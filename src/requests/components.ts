import * as request from 'request-promise-native';
import { Config } from '../commands/config';
import { Component } from '../common';
import { pick } from '../utilities';
import { send } from './index';

function getById(
  id: string,
  visualizationId: string,
  serverConfig: Config,
): Promise<Component> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations/${visualizationId}/components/${id}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    url,
  };

  return send<Component>(requestOptions)
    .then(componentWithBody => componentWithBody)
    .catch(reason => {
      return Promise.reject(reason);
    });
}

function updateBody(
  component: Component,
  body: string,
  serverConfig: Config,
): Promise<void> {
  const { id, visualizationId } = component;
  const { application, username, password } = serverConfig;
  const url = `${application}/service/visualizations/${visualizationId}/components/${id}`;
  const requestOptions: request.Options = {
    auth: { username, password },
    body: JSON.stringify({ ...pick(component, 'name', 'type'), ...{ body } }),
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    method: 'PUT',
    url,
  };

  return send<void>(requestOptions).catch(reason => {
    return Promise.reject(reason);
  });
}

export { getById, updateBody };
