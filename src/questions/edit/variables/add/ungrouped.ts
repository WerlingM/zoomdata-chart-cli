import * as inquirer from 'inquirer';
import ora = require('ora');
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';

const questions: inquirer.Question[] = [
  {
    message: 'Enter the number fields you would like to request:',
    name: 'fieldCount',
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
  const fieldQuestions: inquirer.Question[] = [];
  const groupLevels = parseInt(answers.fieldCount, 10);
  for (let i = 1; i <= groupLevels; i++) {
    fieldQuestions.push({
      message: `Enter a name to identify field ${i}:`,
      name: `fieldName${i}`,
      type: 'input',
    });
  }
  fieldQuestions.push({
    default: 1000,
    message: 'Enter a limit for number of records to retrieve:',
    name: 'limit',
    type: 'input',
    validate: value =>
      typeof parseInt(value, 10) === 'number' &&
      parseInt(value, 10) >= 0 &&
      parseInt(value, 10) <= 1000000,
  });

  return inquirer.prompt(fieldQuestions).then(fieldAnswers => {
    const fieldNames: string[] = [];
    for (let i = 1; i <= groupLevels; i++) {
      fieldNames.push(fieldAnswers[`fieldName${i}`]);
    }
    const variableDef: Variables.Ungrouped = {
      ...varOpts,
      ...{
        config: {
          groupLevel: groupLevels,
          groupNames: fieldNames,
          limit: parseInt(fieldAnswers.limit, 10),
        },
        type: 'ungrouped',
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
