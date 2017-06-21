import * as inquirer from 'inquirer';
import { Config } from '../commands/config';
import { ControlDef, Visualization } from '../common';
import { visualizations } from '../requests';
import ora = require('ora');

const controls: ControlDef[] = [
  {
    description: '',
    id: 'UberStyle',
    name: 'Chart Style',
  },
  {
    description: '',
    id: 'Color',
    name: 'Color',
  },
  {
    description: '',
    id: 'Configure',
    name: 'Configure',
  },
  {
    description: '',
    id: 'ConfigureRaw',
    name: 'Configure Raw',
  },
  {
    description: '',
    id: 'Download',
    name: 'Export',
  },
  {
    description: '',
    id: 'Filters',
    name: 'Filters',
  },
  {
    description: '',
    id: 'Info',
    name: 'Info',
  },
  {
    description: '',
    id: 'Rulers',
    name: 'Rulers',
  },
  {
    description: '',
    id: 'Sort',
    name: 'Sort & Limit',
  },
  {
    description: '',
    id: 'TimePlayer',
    name: 'Time Player',
  },
  {
    description: '',
    id: 'Undo',
    name: 'Undo',
  },
];
const options = controls.map(control => ({
  name: control.name,
  value: control.id,
}));

const questions: inquirer.Question[] = [
  {
    choices: options,
    message: 'Select controls to include in the chart:',
    name: 'controls',
    type: 'checkbox',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  visualization.controls = answers.controls;
  const spinner = ora(`Updating controls for: ${visualization.name}`).start();
  return visualizations
    .update(visualization.id, JSON.stringify(visualization), serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(visualization: Visualization, serverConfig: Config) {
  questions[0].default = visualization.controls;

  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
