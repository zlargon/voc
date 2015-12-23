#!/usr/bin/env node
var path    = require('path');
var fs      = require('fs');
var pkg     = require('./package.json');
var config  = require('./config.json');
var program = require('commander');

// Default Config
var DEFAULT = {
  directory: path.resolve(process.env.HOME, 'vocabulary'),
  audio_cli: 'afplay'
};


// Command Line Interface
program
  .usage('<words...>')
  .option('-v, --version',     "output the version number",                                        version)
  .option('-a, --audio <cli>', "the command line to play .mp3 audio. set defaults to 'afplay'",    setAudioCli)
  .option('-d, --dir <path>',  "set the download directory. set defaults to " + DEFAULT.directory, setAudioDirectory)
  .option('-l, --list',        "list all the configuration",                                       listConfig)
  .option('-r, --reset',       "reset configuration to default",                                   resetConfig);


function version() {
  console.log(pkg.version);
}

function resetConfig() {
  config = DEFAULT;
}

function setAudioCli(cli) {
  config.audio_cli = cli;
}

function setAudioDirectory(path) {
  config.directory = path;
}

function listConfig() {
  for (var key in config) {
    console.log('%s: "%s"', key, config[key]);
  }
}


/* Start */

// init default configuration
if (config.directory === '') {
  resetConfig();
}

// parse command
program.parse(process.argv);

// save configuration
fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

// create directory
try {
  fs.mkdirSync(config.directory);
} catch(e) {
  if (e.code !== 'EEXIST') throw e;
}
