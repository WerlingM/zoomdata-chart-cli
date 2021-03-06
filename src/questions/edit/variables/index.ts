import * as inquirer from 'inquirer';
import { Visualization } from '../../../@types/zoomdata';
import { Config } from '../../../commands/config';
import { strEnum } from '../../../utilities';
import * as addQuestions from './add';
import * as editQuestions from './edit';
import { listVariables } from './list';
import * as removeQuestions from './remove';

const variableOptions = strEnum(['Add', 'Edit', 'List', 'Remove']);

interface ComponentChoiceOption extends inquirer.objects.ChoiceOption {
  name: string;
  value: keyof typeof variableOptions;
}

const options: ComponentChoiceOption[] = [
  {
    name: 'Add a new variable',
    value: 'Add',
  },
  {
    name: 'Edit a variable',
    value: 'Edit',
  },
  {
    name: 'List variables',
    value: 'List',
  },
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
): Promise<string> {
  switch (answers.variables) {
    case variableOptions.Add:
      return addQuestions.prompt(visualization, serverConfig).then(() => 'ADD');
    case variableOptions.Edit:
      return editQuestions
        .prompt(visualization, serverConfig)
        .then(() => 'EDIT');
    case variableOptions.List:
      listVariables(visualization);
      return Promise.resolve('LIST');
    case variableOptions.Remove:
      return removeQuestions
        .prompt(visualization, serverConfig)
        .then(() => 'REMOVE');
    default:
      return Promise.resolve('NOTHING');
  }
}

function prompt(
  visualization: Visualization,
  serverConfig: Config,
): Promise<string> {
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
