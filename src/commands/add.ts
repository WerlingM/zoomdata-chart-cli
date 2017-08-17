import * as fs from 'fs';
import ora = require('ora');
import * as prettyjson from 'prettyjson';
import { libraries, visualizations } from '../requests';
import { Config } from './config';

function add(
  objectName: string,
  filepath: string,
  serverConfig: Config,
  type: string,
) {
  if (type === 'chart') {
    const spinner = ora(`Adding chart: ${objectName}`).start();
    return visualizations
      .importPkg(objectName, fs.createReadStream(filepath), serverConfig)
      .then(() => spinner.succeed())
      .catch(error => {
        spinner.fail();
        console.log(prettyjson.render(error));
        return Promise.reject(error);
      });
  } else {
    const spinner = ora(`Adding library: ${objectName}`).start();
    return libraries
      .add(objectName, fs.createReadStream(filepath), serverConfig)
      .then(() => spinner.succeed())
      .catch(error => {
        spinner.fail();
        console.log(prettyjson.render(error));
        return Promise.reject(error);
      });
  }
}

export { add };
