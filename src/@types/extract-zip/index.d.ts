// Type definitions for extract-zip
// Project: https://github.com/maxogden/extract-zip
// Definitions by: Jonathan Avila <https://github.com/psumstr>

export = ExtractZip;

declare function ExtractZip(sourceFile: string, opts: ExtractZip.TargetOptions, cb: (err: Error) => void): void;

declare namespace ExtractZip {
  interface TargetOptions {
    dir?: string;
    defaultDirMode?: number;
    defaultFileMode?: number;
    onEntry?: (entry: any, zipfile: any) => void;
  }
}
