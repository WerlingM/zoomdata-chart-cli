import * as inquirer from 'inquirer';

const options = ['ATTRIBUTE', 'TIME', 'INTEGER', 'MONEY', 'NUMBER'];

const questions: inquirer.Question[] = [
  {
    choices: options,
    message:
      'Select one or more field types allowed when configuring this variable:',
    name: 'fieldTypes',
    type: 'checkbox',
  },
];

export { questions };
