import * as inquirer from 'inquirer';

const options = [
  {
    name: 'ATTRIBUTE & TIME',
    value: ['ATTRIBUTE', 'TIME'],
  },
  {
    name: 'TIME',
    value: ['TIME'],
  },
];

const questions: inquirer.Question[] = [
  {
    choices: options,
    message: 'Select the field types allowed when configuring this variable:',
    name: 'attributeType',
    type: 'list',
  },
  {
    default: false,
    message: 'Will this variable drive color in your chart?:',
    name: 'colorFlag',
    type: 'confirm',
  },
];

export { questions };
