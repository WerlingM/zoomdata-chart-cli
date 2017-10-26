import * as fuzzy from 'fuzzy';
import * as inquirer from 'inquirer';
import sortBy = require('lodash.sortby');
import ora = require('ora');
import { Visualization } from '../../@types/zoomdata';
import { Config } from '../../commands/config';
import { visualizations } from '../../requests';

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt'),
);

// TODO Change questions type once ChoiceOption has been fixed
const questions: Array<{ [key: string]: any }> = [
  {
    message: 'Select a custom chart:',
    name: 'chart',
    type: 'autocomplete',
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
      (questions[0] as any).source = searchCustomCharts;

      function searchCustomCharts(
        answers: string[],
        input: string,
      ): Promise<any[]> {
        input = input || '';
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(
            input,
            sortBy(customVisualizations, customVis =>
              customVis.name.toLowerCase(),
            ),
            { extract: (el: any) => el.name },
          );
          resolve(
            fuzzyResult.map((el: any) => ({
              name: el.string,
              value: el.original,
            })),
          );
        });
      }

      return inquirer.prompt(questions).then(answers => answerHandler(answers));
    })
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

export { prompt };
