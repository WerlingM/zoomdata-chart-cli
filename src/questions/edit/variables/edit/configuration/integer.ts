import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../../../../@types/zoomdata/index';
import { Integer } from '../../../../../@types/zoomdata/variables';
import { Config } from '../../../../../commands/config';
import { visualizations } from '../../../../../requests';
import { questions } from '../../common/integer';

function answerHandler(
  answers: inquirer.Answers,
  variable: Integer,
  visualization: Visualization,
  serverConfig: Config,
) {
  const currentVariable = visualization.variables.find(
    currVariable => currVariable.id === variable.id,
  );
  if (currentVariable) {
    (currentVariable as Integer).config = {
      max: parseInt(answers.maxValue, 10),
      min: parseInt(answers.minValue, 10),
    };
    (currentVariable as Integer).defaultValue = parseFloat(
      answers.defaultValue,
    );
  }
  const spinner = ora(`Updating variable: ${variable.name}`).start();
  return visualizations
    .update(visualization.id, JSON.stringify(visualization), serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(
  variable: Integer,
  visualization: Visualization,
  serverConfig: Config,
) {
  questions[0].default = variable.config.min;
  questions[1].default = variable.config.max;
  questions[2].default = variable.defaultValue;
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, variable, visualization, serverConfig),
    );
}

export { prompt };
