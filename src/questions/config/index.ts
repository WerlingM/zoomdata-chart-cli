import * as fs from 'fs';
import * as inquirer from 'inquirer';
import { homedir } from 'os';
import * as path from 'path';
import * as Preferences from 'preferences';

const questions: inquirer.Questions = [
  {
    message:
      'Enter the URL for the Zoomdata server (e.g. https://myserver/zoomdata)',
    name: 'application',
    type: 'input',
    validate(value: string) {
      // TODO: Refactor with a better URL validator
      if (value.length > 0) {
        return true;
      } else {
        return 'Please enter a valid server URL';
      }
    },
  },
  {
    message: 'Enter a username to use for server authentication:',
    name: 'username',
    type: 'input',
    validate(value: string) {
      if (value.length > 0) {
        return true;
      } else {
        return 'Please enter a valid username';
      }
    },
  },
  {
    message: "Enter the username's password ",
    name: 'password',
    type: 'password',
    validate(value: string) {
      if (value.length > 0) {
        return true;
      } else {
        return 'Please enter a valid password';
      }
    },
  },
];

function answerHandler(answers: inquirer.Answers): void {
  const configId = 'zd-chart';
  const identifier = configId
    .replace(/[\/?<>\\:*|" ]/g, '.')
    .replace(/\.+/g, '.');
  const homeDir = homedir();
  const dirPath = path.join(homeDir, '.config', 'preferences');
  const filePath = path.join(dirPath, identifier + '.pref');
  //noinspection ReservedWordAsName
  const confirm: inquirer.Questions = [
    {
      default: false,
      message: `Store the above configuration in ${filePath}?:`,
      name: 'configSave',
      type: 'confirm',
    },
  ];

  inquirer.prompt(confirm).then(confirmAnswers => {
    if (confirmAnswers.configSave) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        throw e;
      }
      /* tslint:disable:no-unused-expression */
      new Preferences('zd-chart', answers);
      /* tslint:enable:no-unused-expression */
    }
  });
}

function prompt() {
  return inquirer.prompt(questions).then(answerHandler);
}

export { prompt };
