#!/usr/bin/env node --harmony
var path      = require('path');
var util      = require('util');
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

function list () {
  for (var key in config) {
    console.log('%s: "%s"', key, config[key]);
  }
}

function save () {
  fs.writeFileSync(
    path.resolve(__dirname, 'config.json'),
    JSON.stringify(config, null, 2) + '\n'
  );
  list();
}

function reset () {
  config = DEFAULT;
  save();
}

function setAudioCli (cli) {
  config.audio_cli = cli;
  save();
}

function setAudioDirectory (path) {
  config.directory = path;
  save();
}


// 1. init config
if (config.directory === '') {
  reset();
}

// 2. parse command
program
  .usage('<words...>')
  .version(pkg.version)
  .option('-w, --webster',     "force download audio from webster")
  .option('-c, --collins',     "force download audio from collins")
  .option('-y, --yahoo',       "force download audio from yahoo")
  .option('-g, --google',      "force download audio from google")
  .option('-i, --ispeech',     "force download audio from ispeech")
  .option('-v, --voicerss',    "force download audio from voicerss")
  .option('-a, --audio <cli>', "the command line to play .mp3 audio. set defaults to 'afplay'", setAudioCli)
  .option('-d, --dir <path>',  "set the download directory. set defaults to '~/vocabulary'",    setAudioDirectory)
  .option('-l, --list',        "list all the configuration",                                    list)
  .option('-r, --reset',       "reset configuration to default",                                reset)
  .parse(process.argv);

// show help info if input is empty
if (process.argv.length <= 2) {
  program.help();
}

// 3. create directory
try {
  fs.mkdirSync(config.directory);
} catch(e) {
  if (e.code !== 'EEXIST') throw e;
}

// 4. get and play audio
coroutine(function * () {
  var service = null;
  if (program.yahoo)     service = 'yahoo';
  if (program.collins)   service = 'collins';
  if (program.webster)   service = 'webster';
  if (program.google)    service = 'google';
  if (program.ispeech)   service = 'ispeech';
  if (program.voicerss)  service = 'voicerss';

  var audios = [];
  for (var i = 0; i < program.args.length; i++) {
    var word = program.args[i].replace(/ /g, '_');

    // remove extension '.mp3 or .wav' if any
    var reg = /.(mp3|wav)$/;
    if (word.length > 4 && reg.test(word) === true) {
      word = word.slice(0, -4);
    }

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

  // play audio
  audios.forEach(function (audio) {
    if (audio.path !== null) {
      console.log("play '%s' ...", path.basename(audio.path));
      var cmd = util.format('%s "%s"', config.audio_cli, audio.path);
      exec(cmd);
    } else {
      console.log("'%s' is not found%s", audio.word, service ? ' from ' + service : '');
    }
  });
})
.catch(function (e) {
  console.log(e.stack);
});
