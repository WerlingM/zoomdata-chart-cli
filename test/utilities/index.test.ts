import * as extractZip from 'extract-zip';
import * as fs from 'fs';
import * as shelljs from 'shelljs';
import * as ExtractZip from '../../src/@types/extract-zip';
import {
  parseCredentials,
  parseJSON,
  parseUrl,
  pick,
  readFile,
  strEnum,
  unzipFile,
  writeFile,
} from '../../src/utilities';

jest.mock('fs');

jest.mock('extract-zip', () =>
  jest.fn(
    (
      sourceFile: string,
      opts: ExtractZip.TargetOptions,
      cb: (err: Error) => void,
    ) => {
      cb(undefined);
    },
  ),
);
jest.mock('shelljs', () => ({
  error: jest.fn(),
  rm: jest.fn(),
}));

describe('parses valid json to js objects, otherwise returns an Error', () => {
  it('parses valid json', () => {
    const testJSON =
      '{"id":"58fa0f84e4b021784ebb05b2","templateId":null,"templateType":"UBER_BARS","name":"2 Level Treemap"}';
    const expected = {
      id: '58fa0f84e4b021784ebb05b2',
      name: '2 Level Treemap',
      templateId: null,
      templateType: 'UBER_BARS',
    };
    expect(parseJSON(testJSON)).toEqual(expected);
  });

  it('returns an error with invalid json', () => {
    const invalidJSON = '[{name": "Packed Bubbles"]';
    expect(parseJSON(invalidJSON)).toBeInstanceOf(Error);
  });
});

describe('parses credentials of the form user:pwd', () => {
  it('returns an error when the username is not a string or is empty', () => {
    expect(parseCredentials(':somePWD')).toMatchObject({
      message: 'The username entered is either empty or in an invalid format.',
    });
  });

  it('returns an error when the password is not a string or is empty', () => {
    expect(parseCredentials('admin:')).toMatchObject({
      message: 'The password entered is either empty or in an invalid format.',
    });
  });

  it('converts string admin:somePWD to object {username: admin, password: somePWD', () => {
    expect(parseCredentials('admin:somePWD')).toEqual({
      password: 'somePWD',
      username: 'admin',
    });
  });
});

describe('parses urls with protocols http & https', () => {
  it('returns an error when the URL has an invalid protocol', () => {
    expect(parseUrl('localhost:8080/zoomdata')).toMatchObject({
      message: 'The URL entered is either empty or in an invalid format.',
    });
  });

  it('checks if a string is a valid URL and returns it if true', () => {
    expect(parseUrl('http://localhost:8080/zoomdata')).toBe(
      'http://localhost:8080/zoomdata',
    );
  });
});

it('takes an object and list of properties and returns a new object with the listed properties', () => {
  const testComponent = {
    body: 'Some body',
    id: '58fa0f84e4b021784ebb05b3',
    name: 'visualization.js',
    type: 'text/javascript',
  };
  expect(pick(testComponent, 'name', 'type')).toEqual({
    name: 'visualization.js',
    type: 'text/javascript',
  });
});

it('takes and array of strings and returns a key:value pair ', () => {
  expect(strEnum(['add', 'edit', 'remove'])).toEqual({
    add: 'add',
    edit: 'edit',
    remove: 'remove',
  });
});

describe('write a file with the given name, data, and directory', () => {
  it('is not able to create a directory', () => {
    const spy = jest.spyOn(fs, 'mkdir');
    spy.mockImplementation(
      (
        dirPath: string | Buffer,
        callback?: (err?: NodeJS.ErrnoException) => void,
      ) => {
        return callback(new Error('Unable to create directory'));
      },
    );
    expect.assertions(1);
    return expect(writeFile('/test/dir', 'test.js', 'console.log()')).rejects
      .toMatchObject({ message: 'Unable to create directory' })
      .then(() => {
        spy.mockReset();
        spy.mockRestore();
      })
      .catch(() => {
        spy.mockReset();
        spy.mockRestore();
      });
  });

  it('fails with an error when it can not write the file', () => {
    const spy = jest.spyOn(fs, 'writeFile');
    spy.mockImplementation(
      (
        filename: string,
        data: any,
        callback?: (err: NodeJS.ErrnoException) => void,
      ) => {
        return callback(new Error('Unable to write file'));
      },
    );
    expect.assertions(1);
    return expect(writeFile('/test/dir', 'test.js', 'console.log()')).rejects
      .toMatchObject({ message: 'Unable to write file' })
      .then(() => {
        spy.mockReset();
        spy.mockRestore();
      })
      .catch(() => {
        spy.mockReset();
        spy.mockRestore();
      });
  });

  it('successfully writes to a file', () => {
    expect.assertions(1);
    return expect(
      writeFile('/test/dir', 'test.js', 'console.log()'),
    ).resolves.toBe('console.log()');
  });
});

describe('read a file from the file system', () => {
  const MOCK_FILE_INFO = {
    '/path/to/file1.js': 'console.log("file1 contents");',
    '/path/to/file2.txt': 'file2 contents',
  };

  beforeEach(() => {
    // Set up some mocked out file info before each test
    (fs as any).__setMockFiles(MOCK_FILE_INFO);
  });

  it('fails with an error when it can not read the file', () => {
    const spy = jest.spyOn(fs, 'readFile');
    spy.mockImplementation(
      (
        filename: string,
        encoding: string,
        callback: (err: NodeJS.ErrnoException, data: string) => void,
      ) => {
        return callback(new Error('Unable to write file'), '');
      },
    );
    expect.assertions(1);
    return expect(readFile('/path/to', 'file1.js')).rejects
      .toMatchObject({
        message: 'Unable to write file',
      })
      .then(() => {
        spy.mockReset();
        spy.mockRestore();
      })
      .catch(() => {
        spy.mockReset();
        spy.mockRestore();
      });
  });

  it('reads the contents of the specified file', () => {
    expect.assertions(1);
    return expect(readFile('/path/to', 'file1.js')).resolves.toBe(
      'console.log("file1 contents");',
    );
  });
});

describe('unzip a file to the file system', () => {
  it('fails with an error when it can not unzip the file', () => {
    extractZip.mockImplementationOnce(
      (
        sourceFile: string,
        opts: ExtractZip.TargetOptions,
        cb: (err: Error) => void,
      ) => {
        cb(new Error('Unable to unzip file'));
      },
    );
    expect.assertions(1);
    return expect(
      unzipFile('/path/from/file.zip', '/path/to', true),
    ).rejects.toMatchObject({
      message: 'Unable to unzip file',
    });
  });

  it('fails to remove the zip file', () => {
    const spy = jest.spyOn(shelljs, 'error');
    spy.mockImplementation(() => 'error removing zip file');
    expect.assertions(1);
    return expect(unzipFile('/path/from/file.zip', '/path/to', true)).rejects
      .toBe('error removing zip file')
      .then(() => {
        spy.mockReset();
        spy.mockRestore();
      })
      .catch(() => {
        spy.mockReset();
        spy.mockRestore();
      });
  });

  it('unzips a file into the specified directory', () => {
    expect.assertions(1);
    return expect(
      unzipFile('/path/from/file.zip', '/path/to', false),
    ).resolves.toBe(undefined);
  });
});
