import chalk from 'chalk';
import stripAnsi = require('strip-ansi');
import * as textTable from 'text-table';
import { Visualization } from '../../../@types/zoomdata/index';

export function listVariables(visualization: Visualization) {
  let table = textTable(
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
  tableRows.splice(1, 0, '-'.repeat(stripAnsi(tableRows[0]).length));
  table = tableRows.join('\n');
  console.log(table);
}
