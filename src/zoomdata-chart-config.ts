#!/usr/bin/env node

import * as program from 'commander';
import { config } from './commands/config';

program
  .description(
    "Set-up an encrypted configuration of Zoomdata's server URL and admin credentials",
  )
  .parse(process.argv);

config().catch(() => {
  process.exit(1);
});
