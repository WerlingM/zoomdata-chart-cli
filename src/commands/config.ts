import * as Preferences from 'preferences';
import * as prettyjson from 'prettyjson';
import * as configQuestions from '../questions/config';

interface Config {
  application: string;
  username: string;
  password: string;
}

interface ConfigOptions {
  app?: string;
  user?: ConfigUser;
}

interface ConfigUser {
  username: string;
  password: string;
}

function getConfig(options: ConfigOptions): Config {
  let app = options.app as string;
  let user = options.user as ConfigUser;

  // if program was called with no options, show help.
  if (!app && !user) {
    const savedConfig = new Preferences('zd-chart');

    if (Object.keys(savedConfig).length === 0) {
      console.log(
        'A configuration file was not found. \n' +
          'Please execute the command with the --user and -app options',
      );
    } else {
      app = (savedConfig as any).application;
      user = {
        password: (savedConfig as any).password,
        username: (savedConfig as any).username,
      };
    }
  } else if (!app || !user) {
    // if program was called with either option undefined
    const savedConfig = new Preferences('zd-chart');

    if (Object.keys(savedConfig).length === 0) {
      console.log(
        'A configuration file was not found. \n' +
          'Please execute the command with the --user and -app options',
      );
    } else {
      app = app || (savedConfig as any).application;
      user = user || {
        password: (savedConfig as any).password,
        username: (savedConfig as any).username,
      };
    }
  }

  return {
    application: app,
    password: user && user.password,
    username: user && user.username,
  };
}

function config() {
  return configQuestions.prompt().catch(error => {
    console.log(prettyjson.render);
    return Promise.reject(error);
  });
}

export { Config, ConfigOptions, getConfig, config };
