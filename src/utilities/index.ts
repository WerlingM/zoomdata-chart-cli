import * as Url from 'url';
import attempt = require('lodash.attempt');
import * as fs from 'fs';

function parseJSON(str: string) {
  return attempt(JSON.parse, str);
}

function parseCredentials(value: string) {
  const username = value.split(':')[0];
  const password = value.split(':')[1];

  if (typeof username !== 'string' || username === '') {
    console.log(
      'The username entered is either empty or in an invalid format.',
    );
    process.exit(1);
  }

  if (typeof password !== 'string' || password === '') {
    console.log(
      'The password entered is either empty or in an invalid format.',
    );
    process.exit(1);
  }

  return { username, password };
}

function parseUrl(value: string) {
  const urlObj = Url.parse(value);
  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    console.log('The URL entered is either empty or in an invalid format.');
    process.exit(1);
  }

  return value;
}

function pick(o: { [key: string]: any }, ...props: any[]) {
  return Object.assign({}, ...props.map(prop => ({ [prop]: o[prop] })));
}

function writeFile(dir: string, name: string, body: string) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, mkdirErr => {
      if (mkdirErr && mkdirErr.code !== 'EEXIST') {
        reject(mkdirErr);
      } else {
        fs.writeFile(`${dir}/${name}`, body, writeFileErr => {
          if (writeFileErr) {
            reject(writeFileErr);
          } else {
            resolve(body);
          }
        });
      }
    });
  });
}

function readFile(path: string, name: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${path}/${name}`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export { parseJSON, parseCredentials, parseUrl, pick, writeFile, readFile };
