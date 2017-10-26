import * as fuzzy from 'fuzzy';
import * as inquirer from 'inquirer';
import sortBy = require('lodash.sortby');
import ora = require('ora');
import { Source, Visualization } from '../../@types/zoomdata';
import { Config } from '../../commands/config';
import { edit } from '../../commands/edit';
import { visdefs, visualizations } from '../../requests';

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt'),
);

const questions: inquirer.Question[] = [
  {
    message: 'Enter a name for the new custom chart:',
    name: 'name',
    type: 'input',
    validate(value: string) {
      if (value.length > 3) {
        return true;
      } else {
        return 'Chart name must be greater than 3 characters long';
      }
    },
  },
  {
    message: 'Select a built in template to start from:',
    name: 'template',
    type: 'autocomplete',
  },
  {
    message: 'Select a source to configure with this custom chart:',
    name: 'source',
    type: 'autocomplete',
  },
];

function answerHandler(answers: inquirer.Answers, serverConfig: Config) {
  const body = {
    controlsCfg: { timeControlCfg: {}, playerControlCfg: {} },
    iconName: 'custom_chart',
    name: answers.name,
    templateId: answers.template,
    thumbnailUrl: `images/Template_Custom_Button_sm.png?v=$\{timestamp}`,
  };

  let spinner = ora(`Creating custom chart ${answers.name}`).start();
  return visualizations
    .create(JSON.stringify(body), serverConfig)
    .then((visualization: Visualization) => {
      spinner.succeed();
      //noinspection ReservedWordAsName
      spinner = ora(
        `Setting the default configuration for: ${answers.name} on the selected source`,
      ).start();
      return visdefs
        .setDefaults(answers.source, visualization.id, serverConfig)
        .then(() => {
          spinner.succeed();
          const confirm: inquirer.Questions = [
            {
              default: false,
              message: 'Would you like to edit the new chart?:',
              name: 'newChartEdit',
              type: 'confirm',
            },
          ];

          return inquirer.prompt(confirm).then(confirmAnswers => {
            if (confirmAnswers.newChartEdit) {
              return edit(answers.name, serverConfig);
            } else {
              return Promise.resolve();
            }
          });
        })
        .catch(error => {
          spinner.fail();
          return Promise.reject(error);
        });
    })
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(
  templates: Visualization[],
  sources: Source[],
  serverConfig: Config,
) {
  (questions[1] as any).source = searchTemplates;
  (questions[2] as any).source = searchSources;

  function searchTemplates(answers: string[], input: string): Promise<any[]> {
    input = input || '';
    return new Promise(resolve => {
      const fuzzyResult = fuzzy.filter(
        input,
        sortBy(templates, template => template.name.toLowerCase()),
        { extract: (el: any) => el.name },
      );
      resolve(
        fuzzyResult.map((el: any) => ({
          name: el.string,
          value: el.original.id,
        })),
      );
    });
  }

  function searchSources(answers: string[], input: string): Promise<any[]> {
    input = input || '';
    return new Promise(resolve => {
      const fuzzyResult = fuzzy.filter(
        input,
        sortBy(sources, source => source.name.toLowerCase()),
        { extract: (el: any) => el.name },
      );
      resolve(
        fuzzyResult.map((el: any) => ({
          name: el.string,
          value: el.original.id,
        })),
      );
    });
  }

  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, serverConfig));
}

export { prompt };
