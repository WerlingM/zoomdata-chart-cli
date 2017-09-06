import * as inquirer from 'inquirer';

const questions: inquirer.Question[] = [
  {
    message: 'Enter the minimum value accepted for this variable:',
    name: 'minValue',
    type: 'input',
    validate: value =>
      typeof parseInt(value, 10) === 'number' && parseInt(value, 10) >= 0,
  },
  {
    message: 'Enter the maximum value accepted for this variable:',
    name: 'maxValue',
    type: 'input',
    validate: (value, answers) => {
      if (answers) {
        return (
          typeof parseInt(value, 10) === 'number' &&
          parseInt(value, 10) >= 0 &&
          parseInt(value, 10) >= parseInt(answers.minValue, 10)
        );
      }
      return false;
    },
  },
  {
    message: 'Enter a default value for this variable.',
    name: 'defaultValue',
    type: 'input',
    validate: (value, answers) => {
      if (answers) {
        return (
          typeof parseInt(value, 10) === 'number' &&
          parseInt(value, 10) >= parseInt(answers.minValue, 10) &&
          parseInt(value, 10) <= parseInt(answers.maxValue, 10)
        );
      }
      return false;
    },
  },
];

export { questions };
