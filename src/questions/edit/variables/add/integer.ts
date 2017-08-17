import * as inquirer from 'inquirer';
import ora = require('ora');
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';

const questions: inquirer.Question[] = [
  {
    message: 'Enter the minimum value accepted for this variable:',
    name: 'minValue',
    type: 'input',
    validate: value =>
      typeof parseInt(value, 10) === 'number' && parseInt(value, 10) >= 0,
  },
  {
    message: 'Enter the maximum value accepted for this variable:',
    name: 'maxValue',
    type: 'input',
    validate: (value, answers) => {
      if (answers) {
        return (
          typeof parseInt(value, 10) === 'number' &&
          parseInt(value, 10) >= 0 &&
          parseInt(value, 10) >= parseInt(answers.minValue, 10)
        );
      }
      return false;
    },
  },
  {
    message: 'Enter a default value for this variable. Empty values are valid:',
    name: 'defaultValue',
    type: 'input',
    validate: (value, answers) => {
      if (answers) {
        return (
          typeof parseInt(value, 10) === 'number' &&
          parseInt(value, 10) >= parseInt(answers.minValue, 10) &&
          parseInt(value, 10) <= parseInt(answers.maxValue, 10)
        );
      }
      return false;
    },
  },
];

function answerHandler(
  answers: inquirer.Answers,
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  const variableDef: Variables.Integer = {
    ...varOpts,
    ...{
      config: {
        max: parseInt(answers.maxValue, 10),
        min: parseInt(answers.minValue, 10),
      },
      defaultValue: parseInt(answers.defaultValue, 10),
      type: 'integer',
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
