import * as inquirer from 'inquirer';
import ora = require('ora');
import { Variables, Visualization } from '../../../../../@types/zoomdata/index';
import { MultiMetric } from '../../../../../@types/zoomdata/variables';
import { Config } from '../../../../../commands/config';
import { visualizations } from '../../../../../requests';
import { questions } from '../../common/multi-metric';

function answerHandler(
  answers: inquirer.Answers,
  variable: MultiMetric,
  visualization: Visualization,
  serverConfig: Config,
) {
  const currentVariable = visualization.variables.find(
    currVariable => currVariable.id === variable.id,
  );
  if (currentVariable) {
    if (answers.colorFlag) {
      Object.assign(currentVariable, {
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
    } else {
      (currentVariable as MultiMetric).defaultValue = [
        {
          name: 'count',
        },
      ];
      (currentVariable as MultiMetric).colorNumb = 0;
      delete (currentVariable as MultiMetric).colorSet;
      delete (currentVariable as MultiMetric).legendType;
      delete (currentVariable as MultiMetric).metricType;
    }
  }
  const spinner = ora(`Updating variable: ${variable.name}`).start();
  return visualizations
    .update(visualization.id, JSON.stringify(visualization), serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(
  variable: MultiMetric,
  visualization: Visualization,
  serverConfig: Config,
) {
  questions[0].default = variable.metricType === 'color';
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, variable, visualization, serverConfig),
    );
}

export { prompt };
