import * as inquirer from 'inquirer';
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';
import ora = require('ora');

const questions: inquirer.Question[] = [
  {
    choices: [
      {
        name: 'Custom',
        value: 'CUSTOM',
      },
      {
        name: 'List of Attributes',
        value: 'ATTRIBUTE',
      },
    ],
    message: 'Select the type of list shown when configuring this variable:',
    name: 'listType',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
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
              },
            ];
            return inquirer.prompt(defaultQuestion).then(defaultAnswers => {
              return resolve({
                defaultValue: { name: defaultAnswers.defaultValue },
                values: itemNames,
              });
            });
          });
        })
        .catch(error => reject(error));
    }
    resolve();
  }).then(itemOptions => {
    const variableDef: Variables.Multilist = {
      ...varOpts,
      ...{
        type: 'multilist',
        visualizationId: visualization.id,
      },
    };

    if (itemOptions) {
      Object.assign(variableDef, itemOptions);
    } else {
      Object.assign(variableDef, { attributeType: ['ATTRIBUTE'] });
    }

    visualization.variables.push(variableDef);

    const spinner = ora(
      `Adding variable ${varOpts.name} to: ${visualization.name}`,
    ).start();
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
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, varOpts, visualization, serverConfig),
    );
}

export { prompt };
