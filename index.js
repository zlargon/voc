#!/usr/bin/env node
var path      = require('path');
var fs        = require('fs');
var coroutine = require('co');
var program   = require('commander');
var exec      = require('child_process').execSync;
var getAudio  = require('./src/getAudio');
var config    = require('./config.json');
var pkg       = require('./package.json');

// Default Config
var DEFAULT = {
  directory: path.resolve(process.env.HOME, 'vocabulary'),
  audio_cli: 'afplay' // Mac OS X default audio file player
};


// Command Line Interface
program
  .usage('<words...>')
  .version(pkg.version)
  .option('-w, --webster',     "force download audio from webster")
  .option('-v, --voicetube',   "force download audio from voicetube")
  .option('-y, --yahoo',       "force download audio from yahoo")
  .option('-g, --google',      "force download audio from google")
  .option('-a, --audio <cli>', "the command line to play .mp3 audio. set defaults to 'afplay'", setAudioCli)
  .option('-d, --dir <path>',  "set the download directory. set defaults to '~/vocabulary'",    setAudioDirectory)
  .option('-l, --list',        "list all the configuration",                                    listConfig)
  .option('-r, --reset',       "reset configuration to default",                                resetConfig);

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

// 1. init default configuration
if (config.directory === '') {
  resetConfig();
}

// 2. parse command
program.parse(process.argv);

// 3. save configuration
fs.writeFileSync(
  path.resolve(__dirname, 'config.json'),
  JSON.stringify(config, null, 2) + '\n'
);

// 4. create directory
try {
  fs.mkdirSync(config.directory);
} catch(e) {
  if (e.code !== 'EEXIST') throw e;
}

// show help info if input is empty.
if (process.argv.length <= 2) {
  program.help();
}

// 5. get and play audios
coroutine(function * () {
  var service = null;
  if (program.yahoo)     service = 'yahoo';
  if (program.voicetube) service = 'voicetube';
  if (program.webster)   service = 'webster';
  if (program.google)    service = 'google';

  var audios = [];
  for (var i = 0; i < program.args.length; i++) {
    var word = program.args[i];
    audios[i] = {
      word: word,
      path: null
    };

    try {
      audios[i].path = yield getAudio(word, config.directory, service);
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e;
      }
    }
  }

  // play audios
  audios.forEach(function (audio) {
    if (audio.path !== null) {
      console.log("play '%s' ...", path.basename(audio.path));
      exec(config.audio_cli + ' "' + audio.path + '"');
    } else {
      var msg = "'" + audio.word + "' is not found";
      if (service) msg += " from " + service;
      console.log(msg);
    }
  });
})
.catch(function (e) {
  console.log(e.stack);
});
