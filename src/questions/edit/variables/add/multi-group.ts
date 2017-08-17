import * as inquirer from 'inquirer';
import ora = require('ora');
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';

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

function answerHandler(
  answers: inquirer.Answers,
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  const levelQuestions: inquirer.Question[] = [];
  const groupLevels = parseInt(answers.groupLevels, 10);
  for (let i = 1; i <= groupLevels; i++) {
    levelQuestions.push({
      message: `Enter a name to identify group level ${i}:`,
      name: `groupLevelName${i}`,
      type: 'input',
    });
    levelQuestions.push({
      choices: options,
      message: `Select one or more field types allowed when configuring group level ${i}:`,
      name: `attributeType${i}`,
      type: 'checkbox',
    });
  }
  levelQuestions.push({
    default: false,
    message: 'Will one of the levels drive color in your chart?:',
    name: 'colorFlag',
    type: 'confirm',
  });

  return inquirer.prompt(levelQuestions).then(levelAnswers => {
    return new Promise((resolve, reject) => {
      if (levelAnswers.colorFlag) {
        const colorQuestion: inquirer.Question[] = [
          {
            message: 'Which level should drive color for this chart?:',
            name: 'colorLevel',
            type: 'input',
            validate: value =>
              typeof parseInt(value, 10) === 'number' &&
              parseInt(value, 10) > 0 &&
              parseInt(value, 10) <= groupLevels,
          },
        ];
        return inquirer
          .prompt(colorQuestion)
          .then(colorAnswers => resolve(colorAnswers.colorLevel))
          .catch(error => reject(error));
      }
      resolve();
    }).then(colorLevel => {
      const groupNames: string[] = [];
      const groupTypes: Variables.GroupTypes = [];
      for (let i = 1; i <= groupLevels; i++) {
        groupNames.push(levelAnswers[`groupLevelName${i}`]);
        groupTypes.push(levelAnswers[`attributeType${i}`].join(' '));
      }
      const variableDef: Variables.MultiGroup = {
        ...varOpts,
        ...{
          attributeType: ['ATTRIBUTE', 'TIME'],
          config: {
            groupLevel: groupLevels,
            groupLimits: [50, 20],
            groupNames,
            groupTypes,
          },
          type: 'multi-group',
          visualizationId: visualization.id,
        },
      };

      if (colorLevel) {
        const colorConfig: Variables.GroupConfigBase = {
          autoShowColorLegend: false,
          colorGroupIndex: (colorLevel as number) - 1,
          groupColorSet: 'ZoomPalette',
        };
        Object.assign(variableDef.config, colorConfig);
      }

      visualization.variables.push(variableDef);

      const spinner = ora(
        `Adding variable ${varOpts.name} to: ${visualization.name}`,
      ).start();
      return visualizations
        .update(visualization.id, JSON.stringify(visualization), serverConfig)
        .then(() => spinner.succeed())
        .catch(error => {
          spinner.fail();
          return Promise.reject(error);
        });
    });
  });
}

function prompt(
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  return inquirer
    .prompt(questions)
    .then(answers =>
      answerHandler(answers, varOpts, visualization, serverConfig),
    );
}

export { prompt };
