import * as inquirer from 'inquirer';
import { Config } from '../../commands/config';
import { libraries } from '../../requests';
import ora = require('ora');

const questions: inquirer.Question[] = [
  {
    message: 'Select a library to remove from the server:',
    name: 'library',
    type: 'list',
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
      libraries
        .remove(answers.library, serverConfig)
        .then(() => spinner.succeed())
        .catch(error => {
          spinner.fail();
          return Promise.reject(error);
        });
    }
  });
}

function prompt(serverConfig: Config) {
  const spinner = ora('Fetching libraries').start();
  libraries
    .get(serverConfig)
    .then(libraries => {
      spinner.succeed();
      questions[0].choices = libraries
        .filter(library => typeof library.accountId !== 'undefined')
        .sort((a, b) => (a.filename < b.filename ? -1 : 1))
        .map<inquirer.objects.ChoiceOption>(library => ({
          name: library.filename,
          value: library.id,
        }));

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
