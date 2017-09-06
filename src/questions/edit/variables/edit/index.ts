import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import stripAnsi = require('strip-ansi');
import * as textTable from 'text-table';
import { Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { strEnum } from '../../../../utilities/index';
import * as configurationQuestions from './configuration';
import * as descriptionQuestions from './description';
import * as nameQuestions from './name';

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
  const variableToEdit = visualization.variables.find(
    variable => variable.name === answers.variable,
  );
  if (variableToEdit) {
    const editOptions = strEnum(['Name', 'Description', 'Configuration']);

    type editOption = keyof typeof editOptions;

    const options: editOption[] = ['Name', 'Description'];

    const editQuestions: inquirer.Questions = [
      {
        choices: options,
        message: 'What would you like to edit:',
        name: 'editOptions',
        type: 'list',
      },
    ];

    if (
      variableToEdit.type !== 'box-plot-metric' &&
      variableToEdit.type !== 'histogram-group' &&
      variableToEdit.type !== 'ungroupedList'
    ) {
      options.push('Configuration');
    }

    return inquirer.prompt(editQuestions).then(editAnswers => {
      switch (editAnswers.editOptions) {
        case editOptions.Name:
          return nameQuestions.prompt(
            variableToEdit,
            visualization,
            serverConfig,
          );
        case editOptions.Description:
          return descriptionQuestions.prompt(
            variableToEdit,
            visualization,
            serverConfig,
          );
        case editOptions.Configuration:
          return configurationQuestions.prompt(
            variableToEdit,
            visualization,
            serverConfig,
          );
      }
    });
  }
}

function prompt(visualization: Visualization, serverConfig: Config) {
  const table = textTable(
    [['Name', 'Type', 'Description'].map(str => chalk.yellow(str))].concat(
      visualization.variables.map<string[]>(variable => [
        variable.name,
        variable.type,
        variable.descr,
      ]),
    ),
    {
      align: ['l', 'l', 'l'],
      hsep: '|',
      stringLength: str => stripAnsi(str).length,
    },
  );
  const tableRows = table.split('\n');
  questions[0].choices = ([
    new inquirer.Separator(chalk.green(tableRows[0])),
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
