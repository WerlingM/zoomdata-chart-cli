import * as inquirer from 'inquirer';
import { Visualization } from '../@types/zoomdata';
import { Config } from '../commands/config';
import { visualizations } from '../requests';
import ora = require('ora');

const questions: inquirer.Question[] = [
  {
    name: 'visible',
    type: 'confirm',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  if (answers.visible) {
    visualization.enabled = !visualization.enabled;
  } else {
    console.log("No changes were made to the chart's visibility");
    return Promise.resolve(undefined);
  }

  const spinner = ora(
    `Updating chart's visibility for: ${visualization.name}`,
  ).start();
  return visualizations
    .update(visualization.id, JSON.stringify(visualization), serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(visualization: Visualization, serverConfig: Config) {
  const currentVisibility = visualization.enabled ? 'enabled' : 'disabled';
  const visibilityAction = visualization.enabled ? 'disable' : 'enable';
  questions[0].message = `This chart is currently ${currentVisibility}. Would like to ${visibilityAction} it?:`;
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
