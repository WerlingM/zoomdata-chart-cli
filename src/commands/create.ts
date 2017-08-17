import ora = require('ora');
import * as prettyjson from 'prettyjson';
import * as createQuestions from '../questions/create';
import { visualizations } from '../requests';
import { Config } from './config';

function create(serverConfig: Config) {
  const spinner = ora('Fetching templates').start();
  return visualizations
    .getBuiltIn(serverConfig)
    .then(templates => {
      spinner.succeed();
      return createQuestions.prompt(templates, serverConfig);
    })
    .catch(error => {
      spinner.fail();
      console.log(prettyjson.render(error));
      return Promise.reject(error);
    });
}

export { create };
