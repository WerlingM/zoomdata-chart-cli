import * as inquirer from 'inquirer';
import * as prettyjson from 'prettyjson';
import { visualizations } from '../requests';
import { Config } from './config';
import ora = require('ora');
import { getPkgBuffer } from '../requests/visualizations';
import { unzipFile, writeFile } from '../utilities';

function pull(name: string, serverConfig: Config, dir?: string) {
  const directory = dir ? dir : process.cwd();
  const spinner = ora(`Pulling chart: ${name}`).start();
  return visualizations
    .getByName(name, serverConfig)
    .then(visualization => {
      const visName = visualization.name.toLowerCase().replace(/ /g, '_');
      return getPkgBuffer(visualization.id, serverConfig)
        .then(buffer => writeFile(directory, `${visName}.zip`, buffer))
        .then(() =>
          unzipFile(
            `${directory}/${visName}.zip`,
            `${directory}/${visName}`,
            true,
          ),
        )
        .catch(reason => Promise.reject(reason));
    })
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      console.log(prettyjson.render(error));
      return Promise.reject(error);
    });
}

function promptForCustomVis(config: Config) {
  const spinner = ora('Fetching custom charts').start();
  return visualizations
    .getCustom(config)
    .then(customVisualizations => {
      spinner.succeed();
      const customVisNames = customVisualizations.map(
        visualization => visualization.name,
      );
      const questions: inquirer.Questions = [
        {
          choices: customVisNames,
          message: 'Select a custom chart to pull:',
          name: 'visualization',
          type: 'list',
        },
      ];
      return inquirer.prompt(questions).catch(reason => Promise.reject(reason));
    })
    .catch(error => {
      spinner.fail();
      console.log(prettyjson.render(error));
      return Promise.reject(error);
    });
}

export { pull, promptForCustomVis };
