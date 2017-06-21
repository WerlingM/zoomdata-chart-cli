import ora = require('ora');
import * as prettyjson from 'prettyjson';
import { Visualization } from '../common';
import { edit as editQuestions } from '../questions';
import { visualizations } from '../requests';
import { Config } from './config';

function edit(nameOrVis: string | Visualization, serverConfig: Config) {
  if (typeof nameOrVis === 'object') {
    return editQuestions.prompt(nameOrVis, serverConfig).catch(error => {
      console.log(prettyjson.render);
      return Promise.reject(error);
    });
  }
  const spinner = ora(`Fetching chart: ${nameOrVis}`).start();
  return visualizations
    .getByName(nameOrVis, serverConfig)
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
