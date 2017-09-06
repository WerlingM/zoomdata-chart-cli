import * as inquirer from 'inquirer';

const questions: inquirer.Question[] = [
  {
    choices: [
      {
        name: 'Custom',
        value: 'CUSTOM',
      },
      {
        name: 'List of Attributes',
        value: 'ATTRIBUTE',
      },
    ],
    message: 'Select the type of list shown when configuring this variable:',
    name: 'listType',
    type: 'list',
  },
];

export { questions };
