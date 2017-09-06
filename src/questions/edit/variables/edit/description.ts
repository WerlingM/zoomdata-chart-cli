import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../../../@types/zoomdata';
import { VariableDef } from '../../../../@types/zoomdata/variables/index';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';

const questions: inquirer.Question[] = [
  {
    message: 'Please enter a new description for the variable:',
    name: 'description',
    type: 'input',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  variable: VariableDef,
  visualization: Visualization,
  serverConfig: Config,
): any {
  const variableIndex = visualization.variables.findIndex(
    currVariable => currVariable.name === variable.name,
  );
  variable.descr = answers.description;
  visualization.variables.splice(variableIndex, 1, variable);
  const spinner = ora(
    `Updating description of variable: ${variable.name}`,
  ).start();
  return visualizations
    .update(visualization.id, JSON.stringify(visualization), serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(
  variable: VariableDef,
  visualization: Visualization,
  serverConfig: Config,
) {
  questions[0].default = variable.descr;
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, variable, visualization, serverConfig),
    );
}

export { prompt };
