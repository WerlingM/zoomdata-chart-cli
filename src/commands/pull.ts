import * as inquirer from 'inquirer';
import * as prettyjson from 'prettyjson';
import { visualizations } from '../requests';
import { Config } from './config';
import { getCustomVisualizations } from './ls';
import ora = require('ora');
import { Component, Visualization } from '../common';
import { getById } from '../requests/components';
import { writeFile } from '../utilities';

function getComponents(visualization: Visualization, serverConfig: Config) {
  return Promise.all(
    visualization.components.map((component: Component) =>
      getById(component.id, component.visualizationId, serverConfig),
    ),
  )
    .then(components => {
      return { components, visualization };
    })
    .catch(error => {
      return Promise.reject(error);
    });
}

function writeComponents(
  components: Component[],
  visualization: Visualization,
  dir: string,
) {
  return Promise.all(
    components
      .map(component =>
        writeFile(
          `${dir}/${visualization.name.toLowerCase().replace(/ /g, '_')}`,
          component.name,
          component.body,
        ),
      )
      .concat(writeVisualization(visualization, dir)),
  )
    .then(() => Promise.resolve())
    .catch(error => {
      return Promise.reject(error);
    });
}

function writeVisualization(visualization: Visualization, dir: string) {
  return [
    writeFile(
      `${dir}/${visualization.name.replace(/ /g, '_')}`,
      'visualization.json',
      JSON.stringify(visualization),
    ),
  ];
}

function pull(name: string, serverConfig: Config, dir?: string) {
  const spinner = ora(`Pulling chart: ${name}`).start();
  return visualizations
    .getByName(name, serverConfig)
    .then(visualization => getComponents(visualization, serverConfig))
    .then(({ components, visualization }) =>
      writeComponents(components, visualization, dir ? dir : process.cwd()),
    )
    .then(() => spinner.succeed())
    .catch(reason => {
      spinner.fail();
      console.log(prettyjson.render(reason));
      return Promise.reject(reason.error);
    });
}

async function promptForCustomVis(config: Config) {
  const customVisualizations = await getCustomVisualizations(config);
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
  return inquirer.prompt(questions).catch(reason => {
    console.log(prettyjson.render(reason));
    return Promise.reject(reason.error);
  });
}

export { pull, promptForCustomVis };
