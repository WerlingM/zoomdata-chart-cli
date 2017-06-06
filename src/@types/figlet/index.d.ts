// Type definitions for figlet.js
// Project: https://github.com/patorjk/figlet.js
// Definitions by: Jonathan Avila <https://github.com/psumstr>

export as namespace figlet;

export = Figlet;

declare function Figlet(
  txt: string,
  next: (err: string, data: string) => void,
  options?: Figlet.TextOptions,
): void

declare namespace Figlet {
  interface FontOptions {
    font?: string;
    horizontalLayout?: string;
    verticalLayout?: string;
  }

  type TextOptions = string | FontOptions;

  function textSync(txt: string, options?: TextOptions): string;

  function metadata(
    font: string,
    next: (err: string, options: object, headerComment: string) => void,
  ): void;

  function fonts(next: (err: string, fonts: string[]) => void): void;

  function fontsSync(): void;
}
