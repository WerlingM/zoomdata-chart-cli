import * as request from 'request-promise-native';
import { Config } from '../commands/config';
import { send } from './index';

function setDefaults(sourceId: string, visId: string, serverConfig: Config) {
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

export { setDefaults };
