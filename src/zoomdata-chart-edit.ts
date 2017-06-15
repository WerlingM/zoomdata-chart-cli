#!/usr/bin/env node

import * as program from 'commander';
import { getConfig } from './commands/config';
import { parseCredentials, parseUrl } from './utilities';
import ora = require('ora');
import { edit } from './commands/edit';
import { promptForCustomVis } from './commands/pull';

program
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

const { ...options } = program;
const config = getConfig(options);

if (!config.application || !config.username) {
  program.help();
  process.exit(1);
}

let visName;
if (program.args.length === 0) {
  // Select a custom visualization to pull
  promptForCustomVis(config).then(answer => {
    edit(answer.visualization, config).catch(() => {
      process.exit(1);
    });
  });
} else {
  visName = program.args[0];
  edit(visName, config).catch(() => {
    process.exit(1);
  });
}
