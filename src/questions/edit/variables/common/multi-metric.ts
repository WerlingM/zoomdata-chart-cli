import * as inquirer from 'inquirer';

const questions: inquirer.Question[] = [
  {
    default: false,
    message: 'Will this variable drive color in your chart?:',
    name: 'colorFlag',
    type: 'confirm',
  },
];

export { questions };
