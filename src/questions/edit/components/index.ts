import * as inquirer from 'inquirer';
import { Visualization } from '../../../@types/zoomdata';
import { Config } from '../../../commands/config';
import { strEnum } from '../../../utilities';
import * as addQuestions from './add';
import * as editQuestions from './edit';
import * as orderQuestions from './order';
import * as removeQuestions from './remove';

const componentOptions = strEnum(['Add', 'Edit', 'Order', 'Remove']);

type ComponentOption = keyof typeof componentOptions;

interface ComponentChoiceOption extends inquirer.objects.ChoiceOption {
  name: string;
  value: keyof typeof componentOptions;
}

const options: ComponentChoiceOption[] = [
  {
    name: 'Add a new component',
    value: 'Add',
  },
  {
    name: 'Edit the body of a component',
    value: 'Edit',
  },
  {
    name: 'Re-order how components load',
    value: 'Order',
  },
  {
    name: 'Remove a component',
    value: 'Remove',
  },
];

const questions: inquirer.Question[] = [
  {
    choices: options,
    message: 'Select an option from the following list:',
    name: 'components',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  switch (answers.components) {
    case componentOptions.Add:
      return addQuestions.prompt(visualization, serverConfig);
    case componentOptions.Edit:
      return editQuestions.prompt(visualization, serverConfig);
    case componentOptions.Order:
      return orderQuestions.prompt(visualization, serverConfig);
    case componentOptions.Remove:
      return removeQuestions.prompt(visualization, serverConfig);
  }
}

function prompt(visualization: Visualization, serverConfig: Config) {
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
