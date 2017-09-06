import * as inquirer from 'inquirer';

const questions: inquirer.Question[] = [
  {
    message: 'Enter the number fields you would like to request:',
    name: 'fieldCount',
    type: 'input',
    validate: value =>
      typeof parseInt(value, 10) === 'number' && parseInt(value, 10) >= 1,
  },
];

export { questions };
