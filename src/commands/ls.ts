import ora = require('ora');
import * as prettyjson from 'prettyjson';
import { visualizations } from '../requests';
import { Config } from './config';

function listCustomVisualizations(config: Config) {
  const spinner = ora('Fetching custom charts').start();
  return visualizations
    .getCustom(config)
    .then(customVisualizations => {
      spinner.succeed();
      console.log(prettyjson.render(customVisualizations.map(vis => vis.name)));
    })
    .catch(error => {
      spinner.fail();
      console.log(prettyjson.render(error));
      return Promise.reject(error);
    });
}

export { listCustomVisualizations as ls };
