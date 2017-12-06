import * as request from 'request-promise-native';
import { VisualizationDef } from '../@types/zoomdata';
import { Config } from '../commands/config';
import { send } from './index';

function get(
  sourceId: string,
  visId: string,
  serverConfig: Config,
): Promise<VisualizationDef> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visdefs/${sourceId}/${visId}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    url,
  };

  return send(requestOptions);
}

function update(
  sourceId: string,
  visId: string,
  body: string,
  serverConfig: Config,
) {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visdefs/${sourceId}/${visId}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    body,
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    method: 'PUT',
    url,
  };

  return send(requestOptions);
}

function getDefault(
  sourceId: string,
  visId: string,
  serverConfig: Config,
): Promise<VisualizationDef> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visdefs/default/${sourceId}/${visId}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    url,
  };

  return send(requestOptions);
}

function createDefault(sourceId: string, visId: string, serverConfig: Config) {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visdefs/default/${sourceId}/${visId}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    method: 'POST',
    url,
  };

  return send(requestOptions);
}

function updateWithDefault(
  sourceId: string,
  visId: string,
  serverConfig: Config,
) {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visdefs/default/${sourceId}/${visId}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    method: 'PUT',
    url,
  };

  return send(requestOptions);
}

export { get, update, getDefault, createDefault, updateWithDefault };
