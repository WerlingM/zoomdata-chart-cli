# zoomdata-chart-cli
A CLI tool to manage Zoomdata Custom Charts

## Introduction

The zoomdata-chart-cli is a tool designed to help you manage all aspects of the custom chart creation process in Zoomdata. With the cli, you create new custom charts, update existing ones, and import/export custom charts from/to other Zoomdata servers.

## Getting Started

### NOTE: THIS IS THE INITIAL BETA RELEASE.

### Prerequisites

* Node >= 6.x

### Install

`npm install zoomdata-chart-cli -g`

### Configuration

Upon installation, you may want to configure the default Zoomdata environment to be used by the cli. While this is not a requirement, it greatly improves the user experience since it avoids having to provide the server URL and administrative credentials with every command.

`zd-chart-cli config`

Follow the prompts to store your default server configuration in an encrypted file. The cli checks for the presence of this file if you omit the server or credentials when running a command.

### Help

Access the cli help contents by running `zd-chart help` or a command's help contents by running `zd-chart help <command_name>`
