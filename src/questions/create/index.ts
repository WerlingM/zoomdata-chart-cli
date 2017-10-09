import * as inquirer from 'inquirer';
import ora = require('ora');
import { Source, Visualization } from '../../@types/zoomdata';
import { Config } from '../../commands/config';
import { edit } from '../../commands/edit';
import { visdefs, visualizations } from '../../requests';

const questions: inquirer.Question[] = [
  {
    message: 'Enter a name for the new custom chart:',
    name: 'name',
    type: 'input',
    validate(value: string) {
      if (value.length > 3) {
        return true;
      } else {
        return 'Chart name must be greater than 3 characters long';
      }
    },
  },
  {
    message: 'Select a built in template to start from:',
    name: 'template',
    type: 'list',
  },
  {
    message: 'Select a source to configure with this custom chart:',
    name: 'source',
    type: 'list',
  },
];

function answerHandler(answers: inquirer.Answers, serverConfig: Config) {
  const body = {
    controlsCfg: { timeControlCfg: {}, playerControlCfg: {} },
    iconName: 'custom_chart',
    name: answers.name,
    templateId: answers.template,
    thumbnailUrl: `images/Template_Custom_Button_sm.png?v=$\{timestamp}`,
  };

  let spinner = ora(`Creating custom chart ${answers.name}`).start();
  return visualizations
    .create(JSON.stringify(body), serverConfig)
    .then((visualization: Visualization) => {
      spinner.succeed();
      //noinspection ReservedWordAsName
      spinner = ora(
        `Setting the default configuration for: ${answers.name} on the selected source`,
      ).start();
      return visdefs
        .setDefaults(answers.source, visualization.id, serverConfig)
        .then(() => {
          spinner.succeed();
          const confirm: inquirer.Questions = [
            {
              default: false,
              message: 'Would you like to edit the new chart?:',
              name: 'newChartEdit',
              type: 'confirm',
            },
          ];

          return inquirer.prompt(confirm).then(confirmAnswers => {
            if (confirmAnswers.newChartEdit) {
              return edit(answers.name, serverConfig);
            } else {
              return Promise.resolve();
            }
          });
        })
        .catch(error => {
          spinner.fail();
          return Promise.reject(error);
        });
    })
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(
  templates: Visualization[],
  sources: Source[],
  serverConfig: Config,
) {
  questions[1].choices = templates.map<
    inquirer.objects.ChoiceOption
  >(template => ({ name: template.name, value: template.id }));
  questions[2].choices = sources.map<inquirer.objects.ChoiceOption>(source => ({
    name: source.name,
    value: source.id,
  }));
  return inquirer
    .prompt(questions)
    .then(answers => answerHandler(answers, serverConfig));
}

export { prompt };
