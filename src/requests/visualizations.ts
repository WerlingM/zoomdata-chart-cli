import * as request from 'request-promise-native';
import { Config } from '../commands/config';
import { Visualization } from '../common';
import { send } from './index';

function get(serverConfig: Config): Promise<Visualization[]> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata+json' },
    url,
  };

  return send(requestOptions);
}

function getByName(name: string, serverConfig: Config): Promise<Visualization> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations?name=${name}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata+json' },
    url,
  };

  return send<Visualization[]>(requestOptions)
    .then(visualizations => {
      if (visualizations.length === 0) {
        throw new Error(
          `Visualization with name: "${name}" does not exist in this Zoomdata server`,
        );
      }
      return visualizations[0];
    })
    .catch(reason => {
      return Promise.reject(reason);
    });
}

export { get, getByName };
