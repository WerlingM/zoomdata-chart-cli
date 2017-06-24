#!/usr/bin/env node

import * as program from 'commander';
import { getConfig } from './commands/config';
import { rm } from './commands/rm';
import { parseCredentials, parseUrl } from './utilities';

program
  .description('Remove a custom chart or library from the Zoomdata server')
  .option(
    '-a, --app [URL]',
    'Specify the Zoomdata application server URL (e.g. https://myserver/zoomdata)',
    parseUrl,
  )
  .option(
    '-u, --user [user:password]',
    'Specify the user name and password to use for server authentication.',
    parseCredentials,
  )
  .parse(process.argv);

const { options } = program;
const config = getConfig(options);

if (!config.application || !config.username) {
  program.help();
  process.exit(1);
} else {
  rm(config).catch(() => {
    process.exit(1);
  });
}
