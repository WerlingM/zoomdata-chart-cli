import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../@types/zoomdata';
import { Config } from '../../commands/config';
import { visualizations } from '../../requests';

// TODO Change questions type once ChoiceOption has been fixed
const questions: Array<{ [key: string]: any }> = [
  {
    message: 'Select a custom chart:',
    name: 'chart',
    type: 'list',
  },
];

function answerHandler(answers: inquirer.Answers): Visualization {
  return answers.chart;
}

function prompt(serverConfig: Config) {
  const spinner = ora('Fetching custom charts').start();
  return visualizations
    .getCustom(serverConfig)
    .then(customVisualizations => {
      spinner.succeed();
      questions[0].choices = customVisualizations.map(customVis => ({
        name: customVis.name,
        value: customVis,
      }));

      return inquirer.prompt(questions).then(answers => answerHandler(answers));
    })
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

export { prompt };
