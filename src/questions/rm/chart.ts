import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as prettyjson from 'prettyjson';
import { Visualization } from '../../@types/zoomdata';
import { Config } from '../../commands/config';
import { bookmarks, visualizations } from '../../requests';
import * as selectQuestions from '../common/select';
import ora = require('ora');

function answerHandler(visualization: Visualization, serverConfig: Config) {
  return bookmarks
    .get(serverConfig, { visualizationId: visualization.id, fields: 'name' })
    .then(bmks => {
      if (bmks.bookmarksMap.length > 0) {
        console.log(
          `${chalk.red(
            visualization.name,
          )} cannot be deleted because it is being used in the dashboards below. \n` +
            `You will need to remove all instances of ${chalk.red(
              visualization.name,
            )} from each dashboard before it can be deleted.`,
        );
        console.log(
          chalk.yellow(
            prettyjson.render(bmks.bookmarksMap.map(bookmark => bookmark.name)),
          ),
        );
        return Promise.resolve();
      } else {
        //noinspection ReservedWordAsName
        const confirm: inquirer.Questions = [
          {
            default: false,
            message:
              'Are you sure you would like to remove this chart from the server?:',
            name: 'chartDelete',
            type: 'confirm',
          },
        ];

        return inquirer.prompt(confirm).then(confirmAnswers => {
          if (confirmAnswers.chartDelete) {
            const spinner = ora(
              `Removing chart: ${visualization.name} from the server`,
            ).start();
            return visualizations
              .remove(visualization.id, serverConfig)
              .then(() => {
                spinner.succeed();
                return Promise.resolve();
              })
              .catch(error => {
                spinner.fail();
                return Promise.reject(error);
              });
          } else {
            return Promise.resolve();
          }
        });
      }
    });
}

function prompt(serverConfig: Config) {
  return selectQuestions
    .prompt(serverConfig)
    .then(visualization => answerHandler(visualization, serverConfig));
}

export { prompt };
