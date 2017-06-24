import * as inquirer from 'inquirer';
import { Config } from '../../commands/config';
import { strEnum } from '../../utilities';
import * as chartQuestions from './chart';
import * as libraryQuestions from './library';

const rmOptions = strEnum(['Chart', 'Library']);

type rmOption = keyof typeof rmOptions;

const options: rmOption[] = ['Chart', 'Library'];

const questions: inquirer.Questions = [
  {
    choices: options,
    message: 'What would you like to remove?:',
    name: 'rmOptions',
    type: 'list',
  },
];

function answerHandler(answers: inquirer.Answers, serverConfig: Config): any {
  switch (answers.rmOptions) {
    case rmOptions.Chart:
      return chartQuestions.prompt(serverConfig);
    case rmOptions.Library:
      return libraryQuestions.prompt(serverConfig);
  }
}

function prompt(serverConfig: Config) {
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, serverConfig));
}

export { prompt };
