import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import ora = require('ora');
import * as textTable from 'text-table';
import { Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';

const questions: inquirer.Question[] = [
  {
    message: 'Select the variable you would like to edit:',
    name: 'variable',
    type: 'list',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  console.log(answers);
}

function prompt(visualization: Visualization, serverConfig: Config) {
  const table = textTable(
    [['Name', 'Type', 'Description']].concat(
      visualization.variables.map<string[]>(variable => [
        variable.name,
        variable.type,
        variable.descr,
      ]),
    ),
    {
      align: ['l', 'l', 'l'],
      hsep: '|',
    },
  );
  const tableRows = table.split('\n');
  questions[0].choices = ([
    new inquirer.Separator(chalk.yellow(tableRows[0])),
  ] as any)
    .concat([new inquirer.Separator('-'.repeat(tableRows[0].length))])
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
