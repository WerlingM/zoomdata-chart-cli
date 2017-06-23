#!/usr/bin/env node

import * as program from 'commander';
import * as prettyjson from 'prettyjson';
import { getConfig } from './commands/config';
import { edit } from './commands/edit';
import * as selectQuestions from './questions/common/select';
import { parseCredentials, parseUrl } from './utilities';

program
  .description(
    "Edit a custom chart's controls, components, libraries, name, variables, and/or visibility",
  )
  .arguments('[chartname]')
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
}

let visName;
if (program.args.length === 0) {
  selectQuestions
    .prompt(config)
    .then(visualization => edit(visualization, config))
    .catch(error => {
      console.log(prettyjson.render(error));
      process.exit(1);
    });
} else {
  visName = program.args[0];
  edit(visName, config).catch(() => {
    process.exit(1);
  });
}
