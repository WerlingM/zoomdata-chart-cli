import ora = require('ora');
import * as prettyjson from 'prettyjson';
import { Source } from '../@types/zoomdata/index';
import * as createQuestions from '../questions/create';
import { sources, visualizations } from '../requests';
import { Config } from './config';

function create(serverConfig: Config) {
  let spinner = ora('Fetching templates').start();
  return visualizations
    .getBuiltIn(serverConfig)
    .then(templates => {
      spinner.succeed();
      spinner = ora('Fetching sources').start();
      sources
        .get(serverConfig, { fields: 'name', filterByEdit: true })
        .then((sourcesList: Source[]) => {
          spinner.succeed();
          return createQuestions.prompt(templates, sourcesList, serverConfig);
        })
        .catch(error => {
          spinner.fail();
          console.log(prettyjson.render(error));
          return Promise.reject(error);
        });
    })
    .catch(error => {
      spinner.fail();
      console.log(prettyjson.render(error));
      return Promise.reject(error);
    });
}

export { create };
