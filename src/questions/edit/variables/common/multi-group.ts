import * as inquirer from 'inquirer';

const options = ['NONE', 'ATTRIBUTE', 'TIME'];

const questions: inquirer.Question[] = [
  {
    message: 'Enter the number of grouping levels:',
    name: 'groupLevels',
    type: 'input',
    validate: value =>
      typeof parseInt(value, 10) === 'number' && parseInt(value, 10) >= 2,
  },
];

export { questions };
