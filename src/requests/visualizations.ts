import * as request from 'request-promise-native';
import { Visualization } from '../@types/zoomdata';
import { Config } from '../commands/config';
import { send } from './index';

interface GetParameters {
  enabled?: boolean;
  builtIn?: boolean;
  fields?: string;
  name?: string;
}

function getPkgBuffer(
  visualizationId: string,
  serverConfig: Config,
): Promise<Buffer> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations/export/${visualizationId}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    encoding: null,
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    url,
  };

  return send<Buffer>(requestOptions);
}

function get(
  serverConfig: Config,
  queryOptions?: GetParameters,
): Promise<Visualization[]> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    qs: queryOptions,
    url,
  };

  return send(requestOptions);
}

function getCustom(serverConfig: Config) {
  return get(serverConfig, { builtIn: false }).catch(reason => {
    return Promise.reject(reason);
  });
}

function getByName(name: string, serverConfig: Config): Promise<Visualization> {
  return get(serverConfig, { name })
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

function update(visualizationId: string, body: any, serverConfig: Config) {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations/${visualizationId}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    body,
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    method: 'PUT',
    url,
  };

  return send(requestOptions);
}

function remove(visualizationId: string, serverConfig: Config): Promise<void> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations/${visualizationId}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    method: 'DELETE',
    url,
  };

  return send<void>(requestOptions).catch(reason => {
    return Promise.reject(reason);
  });
}

export { get, getByName, getPkgBuffer, getCustom, update, remove };
