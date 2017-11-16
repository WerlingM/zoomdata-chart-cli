import chalk from 'chalk';
import * as inquirer from 'inquirer';
import ora = require('ora');
import stripAnsi = require('strip-ansi');
import * as textTable from 'text-table';
import { Visualization } from '../../../@types/zoomdata';
import { Config } from '../../../commands/config';
import { visualizations } from '../../../requests';

const questions: inquirer.Question[] = [
  {
    message: 'Select the variable you would like to remove:',
    name: 'variable',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  //noinspection ReservedWordAsName
  const confirm: inquirer.Questions = [
    {
      default: false,
      message: 'Are you sure you would like to remove this variable?:',
      name: 'variableRemove',
      type: 'confirm',
    },
  ];

  return inquirer.prompt(confirm).then(confirmAnswers => {
    if (confirmAnswers.variableRemove) {
      const variableToDelete = visualization.variables.find(
        variable => answers.variable === variable.name,
      );
      visualization.variables = visualization.variables.filter(
        variable => answers.variable !== variable.name,
      );

      const spinner = ora(
        `Removing variable ${
          variableToDelete ? variableToDelete.name : ''
        } from: ${visualization.name}`,
      ).start();
      return visualizations
        .update(visualization.id, JSON.stringify(visualization), serverConfig)
        .then(() => spinner.succeed())
        .catch(error => {
          spinner.fail();
          return Promise.reject(error);
        });
    } else {
      return Promise.resolve(void 0);
    }
  });
}

function prompt(visualization: Visualization, serverConfig: Config) {
  const table = textTable(
    [['Name', 'Type', 'Description'].map(str => chalk.yellow(str))].concat(
      visualization.variables.map<string[]>(variable => [
        variable.name,
        variable.type,
        variable.descr || '',
      ]),
    ),
    {
      align: ['l', 'l', 'l'],
      hsep: '|',
      stringLength: str => stripAnsi(str).length,
    },
  );
  const tableRows = table.split('\n');
  questions[0].choices = ([new inquirer.Separator(tableRows[0])] as any)
    .concat([
      new inquirer.Separator('-'.repeat(stripAnsi(tableRows[0]).length)),
    ])
    .concat(
      tableRows.slice(1).map<inquirer.objects.ChoiceOption>((row, index) => ({
        name: row,
        short: visualization.variables[index].name,
        value: visualization.variables[index].name,
      })),
    );
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
