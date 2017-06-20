import ora = require('ora');
import * as prettyjson from 'prettyjson';
import { edit as editQuestions } from '../questions';
import { visualizations } from '../requests';
import { Config } from './config';

function edit(name: string, serverConfig: Config) {
  const spinner = ora(`Fetching chart: ${name}`).start();
  return visualizations
    .getByName(name, serverConfig)
    .then(visualization => {
      spinner.succeed();
      return editQuestions.prompt(visualization, serverConfig);
    })
    .catch(error => {
      console.log(prettyjson.render);
      return Promise.reject(error);
    });
}

export { edit };
