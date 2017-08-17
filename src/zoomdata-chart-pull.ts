#!/usr/bin/env node

import * as program from 'commander';
import * as prettyjson from 'prettyjson';
import { getConfig } from './commands/config';
import { pull } from './commands/pull';
import * as selectQuestions from './questions/common/select';
import { parseCredentials, parseUrl } from './utilities';

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
  .option('--zip', 'Pull the custom chart in a zip file format')
  .parse(process.argv);

const { dir, ...options } = program.opts();
const { zip } = program;
const config = getConfig(options);

if (
  !config.application ||
  (config.application as any) instanceof Error ||
  !config.username
) {
  program.help();
  process.exit(1);
}

let visName;
if (program.args.length === 0) {
  selectQuestions
    .prompt(config)
    .then(visualization => pull(visualization, config, dir, zip))
    .catch(error => {
      console.log(prettyjson.render(error));
      process.exit(1);
    });
} else {
  visName = program.args[0];
  pull(visName, config, dir, zip).catch(() => {
    process.exit(1);
  });
}
