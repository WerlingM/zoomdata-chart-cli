import * as inquirer from 'inquirer';
import ora = require('ora');
import { Variables, Visualization } from '../../../../../@types/zoomdata/index';
import { Group } from '../../../../../@types/zoomdata/variables';
import { Config } from '../../../../../commands/config';
import { visualizations } from '../../../../../requests';
import { questions } from '../../common/group';

function answerHandler(
  answers: inquirer.Answers,
  variable: Group,
  visualization: Visualization,
  serverConfig: Config,
) {
  const currentVariable = visualization.variables.find(
    currVariable => currVariable.id === variable.id,
  );
  if (currentVariable) {
    (currentVariable as Group).attributeType = answers.attributeType;
    if (answers.colorFlag) {
      const config: Variables.GroupConfigBase = {
        autoShowColorLegend: false,
        colorGroupIndex: 0,
        groupColorSet: 'ZoomPalette',
      };
      Object.assign(currentVariable, { config });
    } else {
      delete (currentVariable as Group).config;
    }
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
  variable: Group,
  visualization: Visualization,
  serverConfig: Config,
) {
  questions[0].default = variable.attributeType.length > 1 ? 0 : 1;
  questions[1].default = !!variable.config;
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, variable, visualization, serverConfig),
    );
}

export { prompt };
