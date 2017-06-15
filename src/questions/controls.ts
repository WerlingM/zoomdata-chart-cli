import * as inquirer from 'inquirer';
import { ControlDef } from '../common';

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

function answerHandler(answers: inquirer.Answers) {
  return answers.controls;
}

export { questions, answerHandler };
