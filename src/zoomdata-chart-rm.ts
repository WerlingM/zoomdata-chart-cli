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

const { type, options } = program;
const config = getConfig(options);

if (!config.application || !config.username) {
  program.help();
  process.exit(1);
} else {
  rm(config, type).catch(() => {
    process.exit(1);
  });
}
