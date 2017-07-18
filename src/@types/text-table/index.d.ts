// Type definitions for text-table
// Project: https://github.com/substack/text-table
// Definitions by: Jonathan Avila <https://github.com/psumstr>

import { strEnum } from '../../utilities';
export = TextTable;

declare function TextTable(
  rows: (string | number)[][],
  options?: TextTable.Options,
): string;

declare namespace TextTable {
  interface Options {
    hsep?: string;
    align?: AlignmentTypes[];
    stringLength?: (s: string) => number;
  }

  type AlignmentTypes = 'l' | 'r' | 'c' | '.';
}
