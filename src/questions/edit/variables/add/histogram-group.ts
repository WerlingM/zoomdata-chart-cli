import ora = require('ora');
import { Variables, Visualization } from '../../../../@types/zoomdata';
import { Config } from '../../../../commands/config';
import { visualizations } from '../../../../requests';

function prompt(
  varOpts: Variables.Core,
  visualization: Visualization,
  serverConfig: Config,
) {
  const variableDef: Variables.HistogramGroup = {
    ...varOpts,
    ...{
      attributeType: ['MONEY', 'INTEGER', 'NUMBER'],
      config: {
        binsCount: 10,
        binsType: 'auto',
        binsWidth: 100,
        cumulative: false,
        values: 'absolute',
      },
      type: 'histogram-group',
      visualizationId: visualization.id,
    },
  };

  visualization.variables.push(variableDef);

  const spinner = ora(
    `Adding variable ${varOpts.name} to: ${visualization.name}`,
  ).start();
  return visualizations
    .update(visualization.id, JSON.stringify(visualization), serverConfig)
    .then(() => spinner.succeed())
    .catch(error => {
      spinner.fail();
      return Promise.reject(error);
    });
}

export { prompt };
