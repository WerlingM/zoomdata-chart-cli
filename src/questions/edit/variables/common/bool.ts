import * as inquirer from 'inquirer';

const questions: inquirer.Question[] = [
  {
    choices: [
      {
        name: 'true',
        value: true,
      },
      {
        name: 'false',
        value: false,
      },
    ],
    message: 'Select the default value for this variable:',
    name: 'defaultValue',
    type: 'list',
  },
];

export { questions };
