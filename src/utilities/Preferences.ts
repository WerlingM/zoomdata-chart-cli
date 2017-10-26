// https://github.com/caffeinalab/preferences/blob/master/index.js
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import { homedir } from 'os';
import * as path from 'path';
import * as writeFileAtomic from 'write-file-atomic';

export function Preferences<T extends object>(
  id: string,
  defs?: T,
  options = { key: null },
): T {
  const preferences: { [key: string]: any } = {};
  const identifier = id
    .replace(/[\/\?<>\\:\*\|" :]/g, '.')
    .replace(/\.+/g, '.');
  // const path = require('path')
  const homeDir = homedir();
  const dirpath = path.join(homeDir, '.config', 'zoomdata');
  const filepath = path.join(dirpath, identifier + '.pref');
  const password = (() => {
    const key = options.key || path.join(homeDir, '.ssh', 'id_rsa');
    try {
      // Use private SSH key or...
      return fs.readFileSync(key).toString('utf8');
    } catch (e) {
      // ...fallback to an id dependant password
      return 'PREFS-' + identifier;
    }
  })();
  let savePristine = false;
  let savedData = null;

  function encode(text: string) {
    const cipher = crypto.createCipher('aes128', password);
    return (
      cipher.update(new Buffer(text).toString('utf8'), 'utf8', 'hex') +
      cipher.final('hex')
    );
  }

  function decode(text: string) {
    const decipher = crypto.createDecipher('aes128', password);
    return (
      decipher.update(String(text), 'hex', 'utf8') + decipher.final('utf8')
    );
  }

  function save() {
    const payload = encode(String(JSON.stringify(preferences) || '{}'));
    try {
      mkdirp.sync(dirpath, parseInt('0700', 8));
      writeFileAtomic.sync(filepath, payload, {
        mode: parseInt('0600', 8),
      });
    } catch (err) {
      console.log(err);
    }
  }

  try {
    // Try to read and decode preferences saved on disc
    savedData = JSON.parse(decode(fs.readFileSync(filepath, 'utf8')));
  } catch (err) {
    // Read error (maybe file doesn't exist) so update with defaults
    savedData = defs || {};
    savePristine = true;
  }

  // Clone object
  for (const o in savedData) {
    if (savedData.hasOwnProperty(o)) {
      preferences[o] = savedData[o];
    }
  }

  // Config file was empty, save default values
  if (savePristine) {
    save();
  }

  // Save all on program exit
  process.on('exit', save);

  return savedData;
}
