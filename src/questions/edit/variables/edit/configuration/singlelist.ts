import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../../../../@types/zoomdata/index';
import { Singlelist } from '../../../../../@types/zoomdata/variables';
import { Config } from '../../../../../commands/config';
import { visualizations } from '../../../../../requests';
import { questions } from '../../common/singlelist';

function answerHandler(
  answers: inquirer.Answers,
  variable: Singlelist,
  visualization: Visualization,
  serverConfig: Config,
) {
  const currentVariable = visualization.variables.find(
    currVariable => currVariable.id === variable.id,
  );
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
      (currentVariable as Singlelist).defaultValue =
        defaultAnswers.defaultValue;
      (currentVariable as Singlelist).values = itemNames;

      const spinner = ora(`Updating variable: ${variable.name}`).start();
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
  variable: Singlelist,
  visualization: Visualization,
  serverConfig: Config,
) {
  questions[0].default = variable.values.length;
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, variable, visualization, serverConfig),
    );
}

export { prompt };
