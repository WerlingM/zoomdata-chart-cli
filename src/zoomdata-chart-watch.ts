#!/usr/bin/env node

import * as program from 'commander';
import { getConfig } from './commands/config';
import { watch } from './commands/watch';
import { parseCredentials, parseUrl } from './utilities';

program
  .description(
    'Watch for changes in chart files and update them in the Zoomdata server',
  )
  .option(
    '-a, --app [URL]',
    'Specify the Zoomdata application server URL (e.g. https://myserver/zoomdata)',
    parseUrl,
  )
  .option(
    '-d, --dir [path/to/source/files]',
    'Directory used to look for the chart to watch.',
  )
  .option(
    '-u, --user [user:password]',
    'Specify the user name and password to use for server authentication.',
    parseCredentials,
  )
  .parse(process.argv);

const { dir, ...options } = program;
const config = getConfig(options);

if (!config.application || !config.username) {
  program.help();
  process.exit(1);
} else {
  watch(config, dir).catch(() => {
    process.exit(1);
  });
}
