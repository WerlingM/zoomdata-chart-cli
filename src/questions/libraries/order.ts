import * as inquirer from 'inquirer';
import { Config } from '../../commands/config';
import { Visualization } from '../../common';
import { visualizations } from '../../requests';
import ora = require('ora');

const librarySelected: string[] = [];

const questions: inquirer.Question[] = [
  {
    name: 'library',
    type: 'list',
  },
];

function answerHandler(answers: inquirer.Answers) {
  librarySelected.push(answers.library);
}

function prompt(visualization: Visualization, serverConfig: Config) {
  function ask(): Promise<any> {
    questions[0].message = `Select the library to load in position: ${librarySelected.length +
      1}`;
    questions[0].choices = visualization.libs.filter(
      libraryId => librarySelected.indexOf(libraryId) < 0,
    );

    return inquirer
      .prompt(questions)
      .then(answers => answerHandler(answers))
      .then(() => {
        if (librarySelected.length < visualization.libs.length) {
          return ask();
        } else {
          visualization.libs.sort((a, b) => {
            return librarySelected.indexOf(a) < librarySelected.indexOf(b)
              ? -1
              : 1;
          });
          const spinner = ora(
            `Updating chart library order in: ${visualization.name}`,
          ).start();
          return visualizations
            .update(
              visualization.id,
              JSON.stringify(visualization),
              serverConfig,
            )
            .then(() => spinner.succeed())
            .catch(error => {
              spinner.fail();
              return Promise.reject(error);
            });
        }
      });
  }
  return ask();
}

export { prompt };
