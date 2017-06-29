import * as inquirer from 'inquirer';
import { ComponentType, Visualization } from '../../../@types/zoomdata';
import { Config } from '../../../commands/config';
import { components } from '../../../requests';
import ora = require('ora');

const componentTypeOptions: ComponentType[] = ['text/css', 'text/javascript'];

const questions: inquirer.Question[] = [
  {
    message: 'Enter a name for the new component: ',
    name: 'componentName',
    type: 'input',
  },
  {
    choices: componentTypeOptions,
    message: 'Select a type of the new component: ',
    name: 'componentType',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  const body = JSON.stringify({
    body: '',
    name: answers.componentName,
    type: answers.componentType,
  });
  const spinner = ora(
    `Adding component ${answers.componentName} to: ${visualization.name}`,
  ).start();
  return components
    .create(visualization.id, body, serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(visualization: Visualization, serverConfig: Config) {
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
