import * as inquirer from 'inquirer';
import keys = require('lodash.keys');
import pick = require('lodash.pick');
import ora = require('ora');
import { Source, Visualization } from '../../@types/zoomdata';
import { Config } from '../../commands/config';
import { edit } from '../../commands/edit';
import { sources, visdefs } from '../../requests';
import { strEnum } from '../../utilities';
import * as componentQuestions from './components';
import * as controlQuestions from './controls';
import * as libraryQuestions from './libraries';
import * as nameQuestions from './name';
import * as variableQuestion from './variables';
import * as visibilityQuestions from './visibility';

const editOptions = strEnum([
  'Components',
  'Controls',
  'Libraries',
  'Name',
  'Variables',
  'Visibility',
]);

type editOption = keyof typeof editOptions;

const options: editOption[] = [
  'Components',
  'Controls',
  'Libraries',
  'Name',
  'Variables',
  'Visibility',
];

const questions: inquirer.Questions = [
  {
    choices: options,
    message: 'What would you like to edit:',
    name: 'editOptions',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
): any {
  return new Promise((resolve, reject) => {
    switch (answers.editOptions) {
      case editOptions.Components:
        return componentQuestions
          .prompt(visualization, serverConfig)
          .then(() => resolve())
          .catch(error => reject(error));
      case editOptions.Controls:
        return controlQuestions
          .prompt(visualization, serverConfig)
          .then(() => resolve())
          .catch(error => reject(error));
      case editOptions.Libraries:
        return libraryQuestions
          .prompt(visualization, serverConfig)
          .then(() => resolve())
          .catch(error => reject(error));
      case editOptions.Name:
        return nameQuestions
          .prompt(visualization, serverConfig)
          .then(() => resolve())
          .catch(error => reject(error));
      case editOptions.Visibility:
        return visibilityQuestions
          .prompt(visualization, serverConfig)
          .then(() => resolve())
          .catch(error => reject(error));
      case editOptions.Variables:
        return variableQuestion
          .prompt(visualization, serverConfig)
          .then(editOperation => {
            /*
            * 1. Find all sources with the custom vis enabled
            * 2. For each source, get the current variable config and default variable config
            * 3. Merge the the existing variable config into the default variable config only
            *    on keys that exist in the default variable config*/
            if (editOperation !== 'LIST' && editOperation !== 'NOTHING') {
              return sources
                .get(serverConfig, {
                  fields: 'name,visualizations',
                  filterByEdit: true,
                })
                .then((sourcesList: Source[]) => {
                  const sourcesWithVisEnabled = sourcesList.filter(source =>
                    source.visualizations.find(
                      visDef => visDef.visId === visualization.id,
                    ),
                  );
                  const spinner = ora(
                    `Updating sources with visualization: "${
                      visualization.name
                    }" enabled"`,
                  ).start();
                  return Promise.all(
                    sourcesWithVisEnabled.map(async source => {
                      const sourceVisDef = await visdefs.get(
                        source.id,
                        visualization.id,
                        serverConfig,
                      );
                      const visDefVariables = sourceVisDef.source.variables;
                      const sourceVisDefaultDef = await visdefs.getDefault(
                        source.id,
                        visualization.id,
                        serverConfig,
                      );
                      const visDefDefaultVariables =
                        sourceVisDefaultDef.source.variables;
                      const defaultVariablesKeys = keys(visDefDefaultVariables);
                      const existingDefaultVariables = pick(
                        visDefVariables,
                        defaultVariablesKeys,
                      );
                      sourceVisDef.source.variables = {
                        ...visDefDefaultVariables,
                        ...existingDefaultVariables,
                      };
                      return visdefs.update(
                        source.id,
                        visualization.id,
                        JSON.stringify(sourceVisDef),
                        serverConfig,
                      );
                    }),
                  )
                    .then(() => {
                      spinner.succeed();
                      return resolve();
                    })
                    .catch(error => {
                      spinner.fail();
                      return reject(error);
                    });
                })
                .catch(error => reject(error));
            }
            return resolve();
          })
          .catch(error => reject(error));
    }
  })
    .then(() => confirmEdit(visualization, serverConfig))
    .catch(error => Promise.reject(error));
}

function prompt(visualization: Visualization, serverConfig: Config) {
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

function confirmEdit(visualization: Visualization, serverConfig: Config) {
  //noinspection ReservedWordAsName
  const confirm: inquirer.Questions = [
    {
      default: false,
      message: 'Would you like to make additional edits?:',
      name: 'chartEdit',
      type: 'confirm',
    },
  ];

  return inquirer.prompt(confirm).then(confirmAnswers => {
    if (confirmAnswers.chartEdit) {
      return edit(visualization.name, serverConfig);
    } else {
      return Promise.resolve();
    }
  });
}

export { prompt };
