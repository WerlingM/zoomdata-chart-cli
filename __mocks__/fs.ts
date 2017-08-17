import * as path from 'path';

interface FileSystem {
  [dir: string]: File[];
}

interface File {
  body: string;
  name: string;
}

let mockFiles: FileSystem = Object.create(null);
function __setMockFiles(newMockFiles: any) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    if (newMockFiles.hasOwnProperty(file)) {
      const dir = path.dirname(file);

      if (!mockFiles[dir]) {
        mockFiles[dir] = [];
      }
      mockFiles[dir].push({
        body: newMockFiles[file],
        name: path.basename(file),
      });
    }
  }
}

function mkdir(
  dirPath: string | Buffer,
  callback?: (err?: NodeJS.ErrnoException) => void,
) {
  if (callback) {
    return callback(undefined);
  }
}

function writeFile(
  filename: string,
  data: any,
  callback?: (err: NodeJS.ErrnoException) => void,
) {
  if (callback) {
    return callback(undefined as any);
  }
}

function readFile(
  filename: string,
  encoding: string,
  callback: (err: NodeJS.ErrnoException, data: string) => void,
) {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);
  const fileIndex = mockFiles[dirName].findIndex(
    file => baseName === file.name,
  );
  return callback(undefined as any, mockFiles[dirName][fileIndex].body);
}

export { __setMockFiles, mkdir, writeFile, readFile };
