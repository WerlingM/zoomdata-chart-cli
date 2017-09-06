import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../../../../@types/zoomdata/index';
import { Multilist } from '../../../../../@types/zoomdata/variables';
import { Config } from '../../../../../commands/config';
import { visualizations } from '../../../../../requests';
import { questions } from '../../common/multilist';

function answerHandler(
  answers: inquirer.Answers,
  variable: Multilist,
  visualization: Visualization,
  serverConfig: Config,
) {
  const currentVariable = visualization.variables.find(
    currVariable => currVariable.id === variable.id,
  );
  return new Promise((resolve, reject) => {
    if (answers.listType === 'CUSTOM') {
      const customQuestion: inquirer.Question[] = [
        {
          message: 'Enter the number of items in the list:',
          name: 'itemNumber',
          type: 'input',
          validate: value =>
            typeof parseInt(value, 10) === 'number' && parseInt(value, 10) >= 1,
        },
      ];
      return inquirer
        .prompt(customQuestion)
        .then(customAnswers => {
          const itemQuestions: inquirer.Question[] = [];
          const itemNumber = parseInt(customAnswers.itemNumber, 10);
          for (let i = 1; i <= itemNumber; i++) {
            itemQuestions.push({
              message: `Enter a name to identify item ${i}:`,
              name: `itemName${i}`,
              type: 'input',
            });
          }

          return inquirer.prompt(itemQuestions).then(itemAnswers => {
            const itemNames: string[] = [];
            for (let i = 1; i <= itemNumber; i++) {
              itemNames.push(itemAnswers[`itemName${i}`]);
            }
            const defaultQuestion: inquirer.Question[] = [
              {
                choices: itemNames,
                message: 'Select a default value(s) from the list:',
                name: 'defaultValue',
                type: 'checkbox',
                validate: value => value.length > 0,
              },
            ];
            return inquirer.prompt(defaultQuestion).then(defaultAnswers => {
              return resolve({
                defaultValue: defaultAnswers.defaultValue.map(
                  (value: string) => ({
                    name: value,
                  }),
                ),
                values: itemNames,
              });
            });
          });
        })
        .catch(error => reject(error));
    }
    resolve();
  }).then(itemOptions => {
    if (itemOptions) {
      Object.assign(currentVariable, itemOptions);
      delete (currentVariable as Multilist).attributeType;
    } else {
      Object.assign(currentVariable, { attributeType: ['ATTRIBUTE'] });
      (currentVariable as Multilist).defaultValue = [];
      delete (currentVariable as Multilist).values;
    }
    const spinner = ora(`Updating variable: ${variable.name}`).start();
    return visualizations
      .update(visualization.id, JSON.stringify(visualization), serverConfig)
      .then(() => spinner.succeed())
      .catch(error => {
        spinner.fail();
        return Promise.reject(error);
      });
  });
}

function prompt(
  variable: Multilist,
  visualization: Visualization,
  serverConfig: Config,
) {
  questions[0].default =
    variable.attributeType && variable.attributeType.indexOf('ATTRIBUTE') >= 0
      ? 'ATTRIBUTE'
      : 'CUSTOM';
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, variable, visualization, serverConfig),
    );
}

export { prompt };
