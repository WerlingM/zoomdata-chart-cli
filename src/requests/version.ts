import * as request from 'request-promise-native';
import { Version } from '../@types/zoomdata/index';
import { Config } from '../commands/config';
import { send } from './index';

function get(serverConfig: Config): Promise<Version> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/version`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    url,
  };

  return send<Version>(requestOptions);
}

export { get };
