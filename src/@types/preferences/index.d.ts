// Type definitions for preferences
// Project: https://github.com/caffeinalab/preferences
// Definitions by: Jonathan Avila <https://github.com/psumstr>

export = Preferences;

declare const Preferences: Preferences.Constructor;

declare namespace Preferences {
  interface Constructor {
    new <T extends object>(id: string, defs?: T): T;
  }
}
