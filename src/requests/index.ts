import * as contentType from 'content-type';
import * as http from 'http';
import * as requestPromise from 'request-promise-native';
import { parseJSON } from '../utilities';
import * as components from './components';
import * as visualizations from './visualizations';

function send<T>(requestOptions: requestPromise.Options): Promise<T> {
  const defaultOptions = {
    simple: true,
    transform: autoParse,
    transform2xxOnly: true,
  };
  const options = { ...defaultOptions, ...requestOptions };

  return requestPromise(options).then(result => result).catch(reason => {
    return Promise.reject(reason);
  });
}

function autoParse(body: any, response: http.IncomingMessage): any {
  if ((response as any).request.method === 'GET') {
    if (
      contentType.parse(response).type === 'application/vnd.zoomdata.v2+json'
    ) {
      const parsedJSON = parseJSON(body);
      if (parsedJSON instanceof Error) {
        throw parsedJSON;
      } else {
        return parsedJSON;
      }
    } else if (
      contentType.parse(response).type === 'application/octet-stream'
    ) {
      return body;
    } else {
      throw new Error('Invalid content type received in response');
    }
  }
}

export { send, visualizations, components };
