import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../../../../@types/zoomdata/index';
import { Attribute } from '../../../../../@types/zoomdata/variables';
import { Config } from '../../../../../commands/config';
import { visualizations } from '../../../../../requests';
import { questions } from '../../common/attribute';

function answerHandler(
  answers: inquirer.Answers,
  variable: Attribute,
  visualization: Visualization,
  serverConfig: Config,
) {
  const currentVariable = visualization.variables.find(
    currVariable => currVariable.id === variable.id,
  );
  if (currentVariable) {
    (currentVariable as Attribute).attributeType = answers.fieldTypes;
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
  variable: Attribute,
  visualization: Visualization,
  serverConfig: Config,
) {
  questions[0].default = variable.attributeType;
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, variable, visualization, serverConfig),
    );
}

export { prompt };
