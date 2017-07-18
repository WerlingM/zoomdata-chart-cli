import * as inquirer from 'inquirer';
import { Visualization } from '../../../@types/zoomdata';
import { Config } from '../../../commands/config';
import { strEnum } from '../../../utilities';
import * as addQuestions from './add';
import * as editQuestions from './edit';
import * as removeQuestions from './remove';

const variableOptions = strEnum(['Add', 'Edit', 'Remove']);

type VariableOption = keyof typeof variableOptions;

interface ComponentChoiceOption extends inquirer.objects.ChoiceOption {
  name: string;
  value: keyof typeof variableOptions;
}

const options: ComponentChoiceOption[] = [
  {
    name: 'Add a new variable',
    value: 'Add',
  },
  // {
  //   name: 'Edit a variable',
  //   value: 'Edit',
  // },
  {
    name: 'Remove a variable',
    value: 'Remove',
  },
];

const questions: inquirer.Question[] = [
  {
    choices: options,
    message: 'Select an option from the following list:',
    name: 'variables',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  switch (answers.variables) {
    case variableOptions.Add:
      return addQuestions.prompt(visualization, serverConfig);
    // case variableOptions.Edit:
    //   return editQuestions.prompt(visualization, serverConfig);
    case variableOptions.Remove:
      return removeQuestions.prompt(visualization, serverConfig);
  }
}

function prompt(visualization: Visualization, serverConfig: Config) {
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
