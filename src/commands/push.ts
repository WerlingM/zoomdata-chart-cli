import ora = require('ora');
import * as prettyjson from 'prettyjson';
import { visualizations } from '../requests';
import { parseJSON, readFile, writeFile } from '../utilities';
import { Config } from './config';
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
    .catch(error => Promise.reject(error));
}

function updateVisConfig(dir: string, config: Config) {
  return getVisConfig(dir)
    .then(visConfig =>
      visualizations.getByName(visConfig.name, config).then(visualization => {
        const updateBodies: Array<Promise<any>> = [];
        visConfig.components.forEach((component: any) =>
          updateBodies.push(
            readFile(`${dir}/components`, component.name).then(
              body => (component.body = body),
            ),
          ),
        );
        visConfig.libs = visualization.libs;
        return Promise.all(updateBodies).then(() =>
          writeFile(dir, VIS_FILE_NAME, JSON.stringify(visConfig)).then(
            visConfigJSON => ({
              visConfigJSON,
              visualizationId: visualization.id,
              visualizationName: visualization.name,
            }),
          ),
        );
      }),
    )
    .catch(error => Promise.reject(error));
}

function push(config: Config, dir?: string) {
  const directory = dir ? dir : process.cwd();
  const spinner = ora('Pushing chart').start();
  return updateVisConfig(directory, config)
    .then(({ visualizationId, visualizationName, visConfigJSON }) => {
      spinner.text = `Pushing chart: ${visualizationName}`;
      return visualizations.update(visualizationId, visConfigJSON, config);
    })
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      console.log(prettyjson.render(error));
      return Promise.reject(error);
    });
}

export { push, getVisConfig };
