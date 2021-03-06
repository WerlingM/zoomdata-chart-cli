import * as inquirer from 'inquirer';
import ora = require('ora');
import { Visualization } from '../../../@types/zoomdata';
import { Config } from '../../../commands/config';
import { libraries, visualizations } from '../../../requests';

const questions: inquirer.Question[] = [
  {
    message: 'Select the libraries to include in the chart:',
    name: 'libraries',
    type: 'checkbox',
  },
];

function answerHandler(
  answers: inquirer.Answers,
  visualization: Visualization,
  serverConfig: Config,
) {
  visualization.libs = answers.libraries;
  const spinner = ora(`Updating libraries for: ${visualization.name}`).start();
  return visualizations
    .update(visualization.id, JSON.stringify(visualization), serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

function prompt(visualization: Visualization, serverConfig: Config) {
  questions[0].default = visualization.libs;

  const spinner = ora('Fetching libraries').start();
  return libraries
    .get(serverConfig)
    .then(libs => {
      spinner.succeed();
      questions[0].choices = ([
        new inquirer.Separator(' = Included Libraries: = '),
      ] as any)
        .concat(
          visualization.libs.map<
            inquirer.objects.ChoiceOption | string
          >(libId => {
            const lib = libs.find(library => library.id === libId);
            return lib ? { name: lib.filename, value: lib.id } : libId;
          }),
        )
        .concat([new inquirer.Separator(' = Available Libraries: = ')] as any)
        .concat(
          libs
            .map<inquirer.objects.ChoiceOption>(library => ({
              name: library.filename,
              value: library.id,
            }))
            .filter(
              libChoice =>
                visualization.libs.indexOf(libChoice.value as string) < 0,
            ),
        );

      return inquirer
        .prompt(questions)
        .then(answers => answerHandler(answers, visualization, serverConfig));
    })
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

export { prompt };
