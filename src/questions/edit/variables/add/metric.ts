import * as inquirer from 'inquirer';
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';
import ora = require('ora');

const questions: inquirer.Question[] = [
  {
    default: false,
    message: 'Will this variable drive color in your chart?:',
    name: 'colorFlag',
    type: 'confirm',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  const variableDef: Variables.Metric = {
    ...varOpts,
    ...{
      attributeType: ['MONEY', 'INTEGER', 'NUMBER'],
      defaultValue: [
        {
          name: 'count',
        },
      ],
      type: 'metric',
      visualizationId: visualization.id,
    },
  };

  if (answers.colorFlag) {
    Object.assign(variableDef, {
      colorNumb: 3,
      colorSet: 'ZoomSequential',
      defaultValue: [
        {
          colorConfig: {
            autoShowColorLegend: true,
          },
          name: 'count',
        },
      ],
      legendType: 'palette',
      metricType: 'color',
    });
  }

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
