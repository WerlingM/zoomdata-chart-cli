import * as request from 'request-promise-native';
import { Bookmarks } from '../@types/zoomdata';
import { Config } from '../commands/config';
import { send } from './index';

interface GetParameters {
  byCurrentUser?: boolean;
  sourceId?: string;
  visualizationId?: string;
  fields?: string;
}

function get(
  serverConfig: Config,
  queryOptions?: GetParameters,
): Promise<Bookmarks> {
  const { application, username, password } = serverConfig;
  const url = `${application}/service/bookmarks`;
  const requestOptions: request.Options = {
    auth: { username, password },
    headers: { 'content-type': 'application/vnd.zoomdata.v2+json' },
    qs: queryOptions,
    url,
  };

  return send<Bookmarks>(requestOptions);
}

export { get };
