import * as request from 'request-promise-native';
import { Source } from '../@types/zoomdata';
import { Config } from '../commands/config';
import { send } from './index';

interface GetParameters {
  fields?: string;
  filterByEdit?: boolean;
}

function get(
  serverConfig: Config,
  queryOptions?: GetParameters,
): Promise<Source[]> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/sources`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    qs: queryOptions,
    url,
  };

  return send(requestOptions);
}

export { get };
