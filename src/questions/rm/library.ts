import * as fuzzy from 'fuzzy';
import * as inquirer from 'inquirer';
import sortBy = require('lodash.sortby');
import ora = require('ora');
import { Config } from '../../commands/config';
import { libraries } from '../../requests';

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt'),
);

const questions: inquirer.Question[] = [
  {
    message: 'Select a library to remove from the server:',
    name: 'library',
    type: 'autocomplete',
  },
];

function answerHandler(answers: inquirer.Answers, serverConfig: Config) {
  //noinspection ReservedWordAsName
  const confirm: inquirer.Questions = [
    {
      default: false,
      message:
        'Are you sure you would like to remove this library from the server?:',
      name: 'libraryDelete',
      type: 'confirm',
    },
  ];

  return inquirer.prompt(confirm).then(confirmAnswers => {
    if (confirmAnswers.libraryDelete) {
      const spinner = ora(
        `Removing library: ${answers.library} from the server`,
      ).start();
      return libraries
        .remove(answers.library, serverConfig)
        .then(() => {
          spinner.succeed();
          return Promise.resolve();
        })
        .catch(error => {
          spinner.fail();
          return Promise.reject(error);
        });
    } else {
      return Promise.resolve();
    }
  });
}

function prompt(serverConfig: Config) {
  const spinner = ora('Fetching libraries').start();
  return libraries
    .get(serverConfig)
    .then(libs => {
      spinner.succeed();
      (questions[0] as any).source = searchLibraries;

      function searchLibraries(
        answers: string[],
        input: string,
      ): Promise<any[]> {
        input = input || '';
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(
            input,
            sortBy(
              libs.filter(library => typeof library.accountId !== 'undefined'),
              library => library.filename.toLowerCase(),
            ),
            { extract: (el: any) => el.filename },
          );
          resolve(
            fuzzyResult.map((el: any) => ({
              name: el.string,
              value: el.original.id,
            })),
          );
        });
      }

      return inquirer
        .prompt(questions)
        .then(answers => answerHandler(answers, serverConfig));
    })
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

export { prompt };
