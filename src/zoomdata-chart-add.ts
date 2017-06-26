#!/usr/bin/env node

import * as program from 'commander';
import { add } from './commands/add';
import { getConfig } from './commands/config';
import { parseCredentials, parseUrl } from './utilities';

program
  .description('Add a custom chart or library to the Zoomdata server')
  .arguments('<name> <filepath>')
  .option(
    '-a, --app [URL]',
    'Specify the Zoomdata application server URL (e.g. https://myserver/zoomdata)',
    parseUrl,
  )
  .option(
    '-t, --type [chart|library]',
    'Set the type of object to remove. Valid options: "chart (default)", "library',
    value => {
      const valueLower = value.toLowerCase();
      if (valueLower === 'chart' || valueLower === 'library') {
        return valueLower;
      } else {
        console.log(
          `Invalid object type: ${valueLower}. Please enter a valid type.`,
        );
        program.help();
        process.exit(1);
      }
    },
    'chart',
  )
  .option(
    '-u, --user [user:password]',
    'Specify the user name and password to use for server authentication.',
    parseCredentials,
  )
  .parse(process.argv);

const { type, ...options } = program.opts();
const config = getConfig(options);

if (!config.application || !config.username) {
  program.help();
  process.exit(1);
}

if (program.args.length < 2) {
  console.log(
    'Invalid number of arguments. Please provide the name and filepath of the chart or library you want to add',
  );
  program.help();
  process.exit(1);
} else {
  const objectName = program.args[0];
  const filepath = program.args[1];
  add(objectName, filepath, config, type).catch(() => {
    process.exit(1);
  });
}
