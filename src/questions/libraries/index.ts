import * as inquirer from 'inquirer';
import { Visualization } from '../../@types/zoomdata';
import { Config } from '../../commands/config';
import { strEnum } from '../../utilities';
import * as includeQuestions from './include';
import * as orderQuestions from './order';

const libraryOptions = strEnum(['Include', 'Order']);

type libraryOption = keyof typeof libraryOptions;

interface LibraryChoiceOption extends inquirer.objects.ChoiceOption {
  name: string;
  value: keyof typeof libraryOptions;
}

const options: LibraryChoiceOption[] = [
  {
    name: 'Include/Exclude libraries in the chart:',
    value: 'Include',
  },
  {
    name: 'Re-order how libraries load',
    value: 'Order',
  },
];

const questions: inquirer.Question[] = [
  {
    choices: options,
    message: 'Select an option from the following list:',
    name: 'libraries',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  switch (answers.libraries) {
    case libraryOptions.Include:
      return includeQuestions.prompt(visualization, serverConfig);
    case libraryOptions.Order:
      return orderQuestions.prompt(visualization, serverConfig);
  }
}

function prompt(visualization: Visualization, serverConfig: Config) {
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
