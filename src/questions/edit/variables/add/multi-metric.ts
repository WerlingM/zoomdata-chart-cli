import * as inquirer from 'inquirer';
import ora = require('ora');
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';
import { questions } from '../common/multi-metric';

function answerHandler(
  answers: inquirer.Answers,
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  const variableDef: Variables.MultiMetric = {
    ...varOpts,
    ...{
      attributeType: ['MONEY', 'INTEGER', 'NUMBER'],
      defaultValue: [
        {
          name: 'count',
        },
      ],
      type: 'multi-metric',
      visualizationId: visualization.id,
    },
  };

  if (answers.colorFlag) {
    Object.assign(variableDef, {
      colorNumb: 3,
      colorSet: 'ZoomPalette',
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
