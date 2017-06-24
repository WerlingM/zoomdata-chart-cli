import ora = require('ora');
import * as prettyjson from 'prettyjson';
import * as rmQuestions from '../questions/rm';
import { Config } from './config';

function rm(serverConfig: Config) {
  return rmQuestions.prompt(serverConfig).catch(error => {
    console.log(prettyjson.render);
    return Promise.reject(error);
  });
}

export { rm };
