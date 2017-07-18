import * as inquirer from 'inquirer';
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import * as attributeQuestions from './attribute';
import * as boolQuestions from './bool';
import * as boxPlotQuestions from './box-plot-metric';
import * as floatQuestions from './float';
import * as groupQuestions from './group';
import * as histogramGroupQuestion from './histogram-group';
import * as integerQuestions from './integer';
import * as metricQuestions from './metric';
import * as mulitGroupQuestions from './multi-group';
import * as multiMetricQuestions from './multi-metric';
import * as multiListQuestion from './multilist';
import * as singleListQuestions from './singlelist';
import * as stringQuestions from './string';
import * as textQuestions from './text';
import * as ungroupedQuestions from './ungrouped';
import * as ungroupedListQuestions from './ungroupedList';

const groupedVariableTypeOptions: Variables.Type[] = [
  'group',
  'multi-group',
  'histogram-group',
];

const metricVariableTypeOptions: Variables.Type[] = [
  'metric',
  'multi-metric',
  'box-plot-metric',
];

const ungroupedVariableTypeOptions: Variables.Type[] = [
  'ungrouped',
  'ungroupedList',
];

const constantVariableTypeOptions: Variables.Type[] = [
  'string',
  'text',
  'integer',
  'float',
  'bool',
  'color',
  'attribute',
  'singlelist',
  'multilist',
];

const questions: inquirer.Question[] = [
  {
    message: 'Select the type of the variable you would like to add: ',
    name: 'variableType',
    type: 'list',
  },
  {
    message: 'Enter a name for the new variable: ',
    name: 'variableName',
    type: 'input',
  },
  {
    message: 'Enter a description for the variable: ',
    name: 'variableDescription',
    type: 'input',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
): any {
  const variableOpts: Variables.Core = {
    colorMetric: false,
    colorNumb: 0,
    defaultValue: '',
    descr: answers.variableDescription,
    name: answers.variableName,
    required: false,
  };

  switch (answers.variableType) {
    case Variables.types.group:
      return groupQuestions.prompt(variableOpts, visualization, serverConfig);
    case Variables.types['multi-group']:
      return mulitGroupQuestions.prompt(
        variableOpts,
        visualization,
        serverConfig,
      );
    case Variables.types['histogram-group']:
      return histogramGroupQuestion.prompt(
        variableOpts,
        visualization,
        serverConfig,
      );
    case Variables.types.metric:
      return metricQuestions.prompt(variableOpts, visualization, serverConfig);
    case Variables.types['multi-metric']:
      return multiMetricQuestions.prompt(
        variableOpts,
        visualization,
        serverConfig,
      );
    case Variables.types['box-plot-metric']:
      return boxPlotQuestions.prompt(variableOpts, visualization, serverConfig);
    case Variables.types.ungrouped:
      return ungroupedQuestions.prompt(
        variableOpts,
        visualization,
        serverConfig,
      );
    case Variables.types.ungroupedList:
      return ungroupedListQuestions.prompt(
        variableOpts,
        visualization,
        serverConfig,
      );
    case Variables.types.attribute:
      return attributeQuestions.prompt(
        variableOpts,
        visualization,
        serverConfig,
      );
    case Variables.types.singlelist:
      return singleListQuestions.prompt(
        variableOpts,
        visualization,
        serverConfig,
      );
    case Variables.types.multilist:
      return multiListQuestion.prompt(
        variableOpts,
        visualization,
        serverConfig,
      );
    case Variables.types.string:
      return stringQuestions.prompt(variableOpts, visualization, serverConfig);
    case Variables.types.text:
      return textQuestions.prompt(variableOpts, visualization, serverConfig);
    case Variables.types.bool:
      return boolQuestions.prompt(variableOpts, visualization, serverConfig);
    case Variables.types.float:
      return floatQuestions.prompt(variableOpts, visualization, serverConfig);
    case Variables.types.integer:
      return integerQuestions.prompt(variableOpts, visualization, serverConfig);
  }
}

function prompt(visualization: Visualization, serverConfig: Config) {
  const containsGroupedVariable = visualization.variables.find(
    variable =>
      variable.type === 'group' ||
      variable.type === 'multi-group' ||
      variable.type === 'histogram-group',
  );

  const containsUngroupedVariable = visualization.variables.find(
    variable =>
      variable.type === 'ungrouped' || variable.type === 'ungroupedList',
  );
  if (containsGroupedVariable) {
    questions[0].choices = ([
      new inquirer.Separator(' = Query Variables: = '),
    ] as any)
      .concat(metricVariableTypeOptions)
      .concat([new inquirer.Separator(' = Constant Variables: = ')] as any)
      .concat(constantVariableTypeOptions);
  } else if (containsUngroupedVariable) {
    questions[0].choices = ([
      new inquirer.Separator(' = Constant Variables: = '),
    ] as any).concat(constantVariableTypeOptions);
  } else {
    questions[0].choices = ([
      new inquirer.Separator(' = Query Variables: = '),
    ] as any)
      .concat(groupedVariableTypeOptions)
      .concat(ungroupedVariableTypeOptions)
      .concat(metricVariableTypeOptions)
      .concat([new inquirer.Separator(' = Constant Variables: = ')] as any)
      .concat(constantVariableTypeOptions);
  }
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, visualization, serverConfig));
}

export { prompt };
