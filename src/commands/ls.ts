import * as prettyjson from 'prettyjson';
import { visualizations } from '../requests';
import { Config } from './config';
import ora = require('ora');

function getCustomVisualizations(serverConfig: Config) {
  const spinner = ora('Fetching custom charts').start();

  return visualizations
    .get(serverConfig)
    .then(visualizations => {
      spinner.succeed();
      return visualizations.filter(vis => vis.type === 'CUSTOM');
    })
    .catch(reason => {
      spinner.fail();
      console.log(prettyjson.render(reason));
      return Promise.reject(reason.error);
    });
}

function listCustomVisualizations(config: Config, verbose?: boolean) {
  return getCustomVisualizations(config)
    .then(customVisualizations => {
      if (verbose) {
        console.log(prettyjson.render(customVisualizations));
      } else {
        console.log(
          prettyjson.render(
            customVisualizations.map(vis => ({
              name: vis.name,
              templateType: vis.templateType,
            })),
          ),
        );
      }
    })
    .catch(error => {
      return Promise.reject(error);
    });
}

export { listCustomVisualizations as ls, getCustomVisualizations };
