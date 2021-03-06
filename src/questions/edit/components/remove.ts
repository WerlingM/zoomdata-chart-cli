import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../../@types/zoomdata';
import { Config } from '../../../commands/config';
import { components } from '../../../requests';

const questions: inquirer.Question[] = [
  {
    message: 'Select the component you would like to remove:',
    name: 'component',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  const componentToDelete = visualization.components.find(
    component => answers.component === component.id,
  );
  const spinner = ora(
    `Removing component ${componentToDelete
      ? componentToDelete.name
      : ''} from: ${visualization.name}`,
  ).start();
  return components
    .remove(visualization.id, answers.component, serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(visualization: Visualization, serverConfig: Config) {
  questions[0].choices = visualization.components.map<
    inquirer.objects.ChoiceOption
  >(component => ({
    name: component.name,
    value: component.id,
  }));
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
