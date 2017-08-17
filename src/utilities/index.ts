import * as extractZip from 'extract-zip';
import * as fs from 'fs';
import attempt = require('lodash.attempt');
import { error, rm } from 'shelljs';
import * as Url from 'url';

function parseJSON(str: string) {
  return attempt(JSON.parse, str);
}

function parseCredentials(value: string) {
  const username = value.split(':')[0];
  const password = value.split(':')[1];
  try {
    if (typeof username !== 'string' || username === '') {
      console.log(
        'The username entered is either empty or in an invalid format.',
      );
      throw new Error(
        'The username entered is either empty or in an invalid format.',
      );
    }

    if (typeof password !== 'string' || password === '') {
      console.log(
        'The password entered is either empty or in an invalid format.',
      );
      throw new Error(
        'The password entered is either empty or in an invalid format.',
      );
    }
  } catch (error) {
    return error;
  }

  return { username, password };
}

function parseUrl(value: string) {
  const urlObj = Url.parse(value);
  try {
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      console.log('The URL entered is either empty or in an invalid format.');
      throw new Error(
        'The URL entered is either empty or in an invalid format.',
      );
    }
  } catch (error) {
    return error;
  }
  return value;
}

function pick(o: { [key: string]: any }, ...props: any[]) {
  return Object.assign({}, ...props.map(prop => ({ [prop]: o[prop] })));
}

function writeFile(dir: string, name: string, body: string | Buffer) {
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

function unzipFile(
  srcFilePath: string,
  targetDir: string,
  removeZip?: boolean,
) {
  return new Promise((resolve, reject) => {
    extractZip(srcFilePath, { dir: targetDir }, err => {
      if (err) {
        reject(err);
      }
      if (removeZip) {
        rm(srcFilePath);
        if (error()) {
          reject(new Error('Unable to remove zip file'));
        }
      }
      resolve();
    });
  });
}

function strEnum<T extends string>(arr: T[]): { [K in T]: K } {
  return arr.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

export {
  parseJSON,
  parseCredentials,
  parseUrl,
  pick,
  writeFile,
  readFile,
  unzipFile,
  strEnum,
};
