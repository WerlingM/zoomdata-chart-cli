import * as inquirer from 'inquirer';
import { Config } from '../commands/config';
import { Visualization } from '../common';
import { strEnum } from '../utilities';
import * as componentQuestions from './components';
import * as controlQuestions from './controls';
import * as libraryQuestions from './libraries';
import * as nameQuestions from './name';

const editOptions = strEnum([
  'Components',
  'Controls',
  'Libraries',
  'Name',
  'Variables',
]);

type editOption = keyof typeof editOptions;

const options: editOption[] = [
  'Components',
  'Controls',
  'Libraries',
  'Name',
  'Variables',
];

const questions: inquirer.Questions = [
  {
    choices: options,
    message: 'What would you like to edit:',
    name: 'editOptions',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
): any {
  switch (answers.editOptions) {
    case editOptions.Components:
      return componentQuestions.prompt(visualization, serverConfig);
    case editOptions.Controls:
      return controlQuestions.prompt(visualization, serverConfig);
    case editOptions.Libraries:
      return libraryQuestions.prompt(visualization, serverConfig);
    case editOptions.Name:
      return nameQuestions.prompt(visualization, serverConfig);
    // case editOptions.Variables:
    //   return editOptions.Variables;
  }
}

function prompt(visualization: Visualization, serverConfig: Config) {
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
