#!/usr/bin/env node

import * as program from 'commander';
import * as prettyjson from 'prettyjson';
import { getConfig } from './commands/config';
import { parseCredentials, parseUrl } from './utilities';
import ora = require('ora');
import { pull } from './commands/pull';
import * as selectQuestions from './questions/select';

program
  .description(
    'Pull the latest version of a custom chart from the Zoomdata server',
  )
  .arguments('[chartname]')
  .option(
    '-a, --app [URL]',
    'Specify the Zoomdata application server URL (e.g. https://myserver/zoomdata)',
    parseUrl,
  )
  .option(
    '-d, --dir [path/to/store/visualization]',
    'Store the custom chart in the specified directory.',
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
}

let visName;
if (program.args.length === 0) {
  selectQuestions
    .prompt(config)
    .then(visualization => pull(visualization, config, dir))
    .catch(error => {
      console.log(prettyjson.render(error));
      process.exit(1);
    });
} else {
  visName = program.args[0];
  pull(visName, config, dir).catch(() => {
    process.exit(1);
  });
}
