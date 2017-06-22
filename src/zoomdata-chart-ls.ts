#!/usr/bin/env node

import * as program from 'commander';
import { getConfig } from './commands/config';
import { ls } from './commands/ls';
import { parseCredentials, parseUrl } from './utilities';

program
  .description('List custom visualizations')
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
  .parse(process.argv);

const { options } = program;
const config = getConfig(options);

if (!config.application || !config.username) {
  program.help();
  process.exit(1);
} else {
  ls(config).catch(() => {
    process.exit(1);
  });
}
