import ora = require('ora');
import * as inquirer from 'inquirer';
import * as prettyjson from 'prettyjson';
import { Visualization } from '../common';
import {
  controls as controlsQuestions,
  edit as editQuestions,
} from '../questions';
import { editOptions } from '../questions/edit';
import { visualizations } from '../requests';
import { Config } from './config';

function promptControlQuestions(visualization: Visualization) {
  controlsQuestions.questions[0].default = visualization.controls;
  return inquirer
    .prompt(controlsQuestions.questions)
    .then(controlsQuestions.answerHandler);
}

function promptEditQuestions() {
  return inquirer
    .prompt(editQuestions.questions)
    .then(editQuestions.answerHandler);
}

function edit(name: string, serverConfig: Config) {
  let spinner = ora(`Fetching chart: ${name}`).start();
  return visualizations
    .getByName(name, serverConfig)
    .then(visualization => {
      spinner.succeed();
      return promptEditQuestions().then(selection => {
        switch (selection) {
          case editOptions.Components:
            break;
          case editOptions.Controls:
            promptControlQuestions(visualization).then(controls => {
              visualization.controls = controls;
              spinner = ora(`Updating controls for: ${name}`).start();
              visualizations
                .update(
                  visualization.id,
                  JSON.stringify(visualization),
                  serverConfig,
                )
                .then(() => spinner.succeed())
                .catch(error => {
                  spinner.fail();
                  return Promise.reject(error);
                });
            });
            break;
          case editOptions.Libraries:
            break;
          case editOptions.Variables:
            break;
        }
      });
    })
    .catch(error => {
      console.log(prettyjson.render);
      return Promise.reject(error);
    });
}

export { edit };
