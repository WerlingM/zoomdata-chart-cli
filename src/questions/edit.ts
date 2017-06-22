import * as inquirer from 'inquirer';
import { Visualization } from '../@types/zoomdata';
import { Config } from '../commands/config';
import { strEnum } from '../utilities';
import * as componentQuestions from './components';
import * as controlQuestions from './controls';
import * as libraryQuestions from './libraries';
import * as nameQuestions from './name';
import * as visibilityQuestions from './visibility';

const editOptions = strEnum([
  'Components',
  'Controls',
  'Libraries',
  'Name',
  'Variables',
  'Visibility',
]);

type editOption = keyof typeof editOptions;

const options: editOption[] = [
  'Components',
  'Controls',
  'Libraries',
  'Name',
  'Variables',
  'Visibility',
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
    case editOptions.Visibility:
      return visibilityQuestions.prompt(visualization, serverConfig);
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
