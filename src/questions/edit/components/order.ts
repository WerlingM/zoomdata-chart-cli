import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../../@types/zoomdata';
import { Config } from '../../../commands/config';
import { visualizations } from '../../../requests';

const componentsSelected: string[] = [];

const questions: inquirer.Question[] = [
  {
    name: 'component',
    type: 'list',
  },
];

function answerHandler(answers: inquirer.Answers) {
  componentsSelected.push(answers.component);
}

function prompt(visualization: Visualization, serverConfig: Config) {
  function ask(): Promise<any> {
    questions[0].message = `Select the component to load in position: ${componentsSelected.length +
      1}`;
    questions[0].choices = visualization.components
      .filter(
        component => !componentsSelected.find(val => component.id === val),
      )
      .map<inquirer.objects.ChoiceOption>(component => ({
        name: component.name,
        value: component.id,
      }));
    return inquirer
      .prompt(questions)
      .then(answers => answerHandler(answers))
      .then(() => {
        if (componentsSelected.length < visualization.components.length) {
          return ask();
        } else {
          visualization.components.sort((a, b) => {
            return componentsSelected.indexOf(a.id) <
            componentsSelected.indexOf(b.id)
              ? -1
              : 1;
          });
          const spinner = ora(
            `Updating chart component order in: ${visualization.name}`,
          ).start();
          return visualizations
            .update(
              visualization.id,
              JSON.stringify(visualization),
              serverConfig,
            )
            .then(() => spinner.succeed())
            .catch(error => {
              spinner.fail();
              return Promise.reject(error);
            });
        }
      });
  }
  return ask();
}

export { prompt };
