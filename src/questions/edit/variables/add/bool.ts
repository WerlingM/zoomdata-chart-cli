import * as inquirer from 'inquirer';
import ora = require('ora');
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';

const questions: inquirer.Question[] = [
  {
    choices: [
      {
        name: 'true',
        value: true,
      },
      {
        name: 'false',
        value: false,
      },
    ],
    message: 'Select the default value for this variable:',
    name: 'defaultValue',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  const variableDef: Variables.Bool = {
    ...varOpts,
    ...{
      defaultValue: answers.defaultValue,
      type: 'bool',
      visualizationId: visualization.id,
    },
  };

  visualization.variables.push(variableDef);

  const spinner = ora(
    `Adding variable ${varOpts.name} to: ${visualization.name}`,
  ).start();
  return visualizations
    .update(visualization.id, JSON.stringify(visualization), serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, varOpts, visualization, serverConfig),
    );
}

export { prompt };
