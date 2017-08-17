import * as chokidar from 'chokidar';
import ora = require('ora');
import * as prettyjson from 'prettyjson';
import { Component } from '../@types/zoomdata';
import { updateBody } from '../requests/components';
import { readFile } from '../utilities';
import { Config } from './config';
import { getVisConfig } from './push';

function watchComponents(components: Component[], config: Config, dir: string) {
  return Promise.all(
    components.map((component: any) => watchComponent(component, config, dir)),
  )
    .then(() => Promise.resolve())
    .catch(error => {
      return Promise.reject(error);
    });
}

function watchComponent(component: Component, config: Config, dir: string) {
  return new Promise((resolve, reject) => {
    chokidar.watch(`${dir}/components/${component.name}`).on('change', () => {
      readFile(`${dir}/components`, component.name)
        .then((body: string) => {
          console.log(`
              Updating component: ${component.name}...`);
          updateBody(component, body, config).catch(reject);
        })
        .catch(reject);
    });
    resolve();
  });
}

function watch(config: Config, dir?: string) {
  const directory = dir ? dir : process.cwd();
  const spinner = ora({
    spinner: 'pong',
  });
  return getVisConfig(directory)
    .then(visConfig => {
      spinner.text = `Watching visualization: ${visConfig.name}`;
      return watchComponents(visConfig.components, config, directory);
    })
    .then(() => spinner.start())
    .catch(error => {
      spinner.fail();
      console.log(prettyjson.render(error));
      return Promise.reject(error);
    });
}

export { watch };
