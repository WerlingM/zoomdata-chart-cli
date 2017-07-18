import * as inquirer from 'inquirer';
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';
import ora = require('ora');

const questions: inquirer.Question[] = [
  {
    message: 'Enter the number of items in the list:',
    name: 'itemNumber',
    type: 'input',
    validate: value =>
      typeof parseInt(value, 10) === 'number' && parseInt(value, 10) >= 1,
  },
];

function answerHandler(
  answers: inquirer.Answers,
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  const itemQuestions: inquirer.Question[] = [];
  const itemNumber = parseInt(answers.itemNumber, 10);
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
        message: 'Select a default value from the list:',
        name: 'defaultValue',
        type: 'list',
      },
    ];
    return inquirer.prompt(defaultQuestion).then(defaultAnswers => {
      const variableDef: Variables.Singlelist = {
        ...varOpts,
        ...{
          defaultValue: defaultAnswers.defaultValue,
          type: 'singlelist',
          values: itemNames,
          visualizationId: visualization.id,
        },
      };

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
