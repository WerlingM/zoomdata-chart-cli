import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../../@types/zoomdata';
import { Config } from '../../../commands/config';
import { components } from '../../../requests';

const questions: inquirer.Question[] = [
  {
    message: 'Select a component to edit its body:',
    name: 'component',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  const componentToEdit = visualization.components.find(
    component => answers.component === component.id,
  );

  return components
    .getById(answers.component, visualization.id, serverConfig)
    .then(component => {
      component.visualizationId = visualization.id;
      const editorQuestion: inquirer.Question[] = [
        {
          default: component.body,
          message: 'Editing...',
          name: 'componentBody',
          type: 'editor',
        },
      ];

      return inquirer.prompt(editorQuestion).then(editorAnswer => {
        const spinner = ora(
          `Updating component ${componentToEdit
            ? componentToEdit.name
            : ''} in: ${visualization.name}`,
        ).start();

        return components
          .updateBody(component, editorAnswer.componentBody, serverConfig)
          .then(() => spinner.succeed())
          .catch(error => {
            spinner.fail();
            return Promise.reject(error);
          });
      });
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
