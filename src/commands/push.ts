import { Config } from './config';
import ora = require('ora');
import * as prettyjson from 'prettyjson';
import { Component } from '../common';
import { updateBody } from '../requests/components';
import { parseJSON, readFile } from '../utilities';
const VIS_FILE_NAME = 'visualization.json';

function getVisConfig(dir: string) {
  return readFile(dir, VIS_FILE_NAME)
    .then((visConfigJSON: string) => {
      const visConfig = parseJSON(visConfigJSON);
      if (!(visConfig instanceof Error)) {
        return visConfig;
      } else {
        throw visConfig;
      }
    })
    .catch(reason => {
      console.log(prettyjson.render(reason));
      return Promise.reject(reason.error);
    });
}

function updateComponents(
  components: Component[],
  serverConfig: Config,
  dir: string,
) {
  return Promise.all(
    components.map(component =>
      readFile(dir, component.name).then((body: string) =>
        updateBody(component, body, serverConfig),
      ),
    ),
  )
    .then(() => Promise.resolve())
    .catch(error => {
      return Promise.reject(error);
    });
}

function push(config: Config, dir?: string) {
  const directory = dir ? dir : process.cwd();
  const spinner = ora('Pushing chart').start();
  return getVisConfig(directory)
    .then(visConfig =>
      updateComponents(visConfig.components, config, directory),
    )
    .then(() => spinner.succeed())
    .catch(reason => {
      spinner.fail();
      console.log(prettyjson.render(reason));
      return Promise.reject(reason.error);
    });
}

export { push, getVisConfig };
