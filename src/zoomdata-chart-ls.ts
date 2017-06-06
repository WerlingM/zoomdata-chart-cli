#!/usr/bin/env node

import * as program from 'commander';
import ora = require('ora');
import { getConfig } from './commands/config';
import { ls } from './commands/ls';
import { parseCredentials, parseUrl } from './utilities';

program
  .option(
    '-u, --user [user:password]',
    'Specify the user name and password to use for server authentication.',
    parseCredentials,
  )
  .option(
    '-a, --app [URL]',
    'Specify the Zoomdata application server URL (e.g. https://myserver/zoomdata)',
    parseUrl,
  )
  .option(
    '-v, --verbose ',
    'Outputs the full definition of the visualizations. ' +
      'If this option is not provided, only the name and templateType will be returned',
  )
  .parse(process.argv);

const { verbose, ...options } = program;
const config = getConfig(options);

if (!config.application || !config.username) {
  program.help();
  process.exit(1);
} else {
  ls(config, verbose).catch(() => {
    process.exit(1);
  });
}
