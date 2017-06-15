import * as inquirer from 'inquirer';
import { strEnum } from '../utilities';

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

function answerHandler(answers: inquirer.Answers) {
  let selection: editOption;
  switch (answers.editOptions) {
    case editOptions.Components:
      selection = editOptions.Components;
      break;
    case editOptions.Controls:
      selection = editOptions.Controls;
      break;
    case editOptions.Libraries:
      selection = editOptions.Libraries;
      break;
    case editOptions.Variables:
      selection = editOptions.Variables;
      break;
    default:
      return;
  }

  return selection;
}

export { questions, answerHandler, editOptions, editOption };
