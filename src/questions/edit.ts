import * as inquirer from 'inquirer';
import { Config } from '../commands/config';
import { Visualization } from '../common';
import { strEnum } from '../utilities';
import * as componentQuestions from './components';
import * as controlQuestions from './controls';

const editOptions = strEnum([
  'Components',
  'Controls',
  'Libraries',
  'Variables',
]);

type editOption = keyof typeof editOptions;

const options: editOption[] = [
  'Components',
  'Controls',
  'Libraries',
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
    // case editOptions.Libraries:
    //   return editOptions.Libraries;
    // case editOptions.Variables:
    //   return editOptions.Variables;
  }
}

function prompt(visualization: Visualization, serverConfig: Config) {
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { questions, answerHandler, prompt, editOptions, editOption };