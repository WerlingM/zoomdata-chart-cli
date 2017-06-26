import ora = require('ora');
import * as prettyjson from 'prettyjson';
import * as rmQuestions from '../questions/rm';
import { Config } from './config';

function rm(serverConfig: Config, type: string) {
  return (type === 'chart'
    ? rmQuestions.chart.prompt(serverConfig)
    : rmQuestions.library.prompt(serverConfig)).catch(error => {
    console.log(prettyjson.render(error));
    return Promise.reject(error);
  });
}

export { rm };
