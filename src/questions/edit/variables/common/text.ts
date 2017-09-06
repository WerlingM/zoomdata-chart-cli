import * as inquirer from 'inquirer';

const questions: inquirer.Question[] = [
  {
    message: 'Enter a default value for this variable. Empty values are valid:',
    name: 'defaultValue',
    type: 'input',
  },
];

export { questions };
