import * as request from 'request-promise-native';
import { Library } from '../@types/zoomdata';
import { Config } from '../commands/config';
import { send } from './index';

function getById(id: string, serverConfig: Config): Promise<string> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations/libs2/${id}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    url,
  };

  return send<string>(requestOptions).catch(reason => {
    return Promise.reject(reason);
  });
}

function get(serverConfig: Config): Promise<Library[]> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations/libs`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    url,
  };

  return send(requestOptions);
}

function remove(id: string, serverConfig: Config): Promise<void> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations/libs/${id}`;
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

export { get, getById, remove };
