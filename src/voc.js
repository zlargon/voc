require('babel-polyfill');

const _async_  = require('co').wrap;
const path     = require('path');
const fs       = require('fs');
const program  = require('commander');
const child    = require('child_process');
const getAudio = require('./getAudio');
const pkg      = require('../package.json');

let config   = require('../config.json');

function exec (command) {
  return new Promise((resolve, reject) => {
    child.exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout | stderr);
      }
    });
  });
}

function list () {
  for (var key in config) {
    console.log('%s: "%s"', key, config[key]);
  }
}

function save () {
  fs.writeFileSync(
    path.resolve(__dirname, '../config.json'),
    JSON.stringify(config, null, 2) + '\n'
  );
  list();
}

function reset () {
  switch (process.platform) {
    // Windows
    case 'win32':
      config = {
        directory: path.resolve(process.env.USERPROFILE, 'vocabulary'),
        audio_cli: 'dlc -p'
      };
      break;

    // MacOS
    case 'darwin':
      config = {
        directory: path.resolve(process.env.HOME, 'vocabulary'),
        audio_cli: 'afplay'
      };
      break;

    // UNIX
    default:
      config = {
        directory: path.resolve(process.env.HOME, 'vocabulary'),
        audio_cli: 'mpg123 -q'
      };
      break;
  }
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

module.exports = _async_(function * (process_argv) {
  // 1. init config
  if (config.directory === '') {
    reset();
  }

  // 2. parse command
  program
    .usage('<words...>')
    .version(pkg.version)
    .option('-w, --webster',     "force download audio from webster")
    .option('-y, --yahoo',       "force download audio from yahoo")
    .option('-c, --collins',     "force download audio from collins")
    .option('-g, --google',      "force download audio from google")
    .option('-i, --ispeech',     "force download audio from ispeech")
    .option('-v, --voicerss',    "force download audio from voicerss")
    .option('-a, --audio <cli>', "the command line to play .mp3 audio. set defaults to 'afplay'", setAudioCli)
    .option('-d, --dir <path>',  "set the download directory. set defaults to '~/vocabulary'",    setAudioDirectory)
    .option('-l, --list',        "list all the configuration",                                    list)
    .option('-r, --reset',       "reset configuration to default",                                reset)
    .parse(process_argv);

  // show help info if input is empty
  if (process_argv.length <= 2) {
    program.help();
  }

  // 3. create directory
  try {
    fs.mkdirSync(config.directory);
  } catch(e) {
    if (e.code !== 'EEXIST') throw e;
  }

  // 4. choice the service
  let service = null;
  if (program.yahoo)    service = 'yahoo';
  if (program.collins)  service = 'collins';
  if (program.webster)  service = 'webster';
  if (program.google)   service = 'google';
  if (program.ispeech)  service = 'ispeech';
  if (program.voicerss) service = 'voicerss';

  // 5. test audio player command line
  let cli = config.audio_cli.split(' ')[0];
  try {
    yield exec('which ' + cli);
  } catch (e) {
    console.log(`\naudio player command line "${cli}" is not found.\n`);

    switch (cli) {
      case 'dlc':
        console.log('Download DLC player');
        console.log('http://dlcplayer.jimdo.com/');
        break;

      case 'mpg123':
        console.log('Download mpg123 player');
        console.log('http://www.mpg123.de');
        console.log('$ sudo apt-get install mpg123');
        break;
    }

    console.log('');
    return;
  }

  // 6. download and play audio
  for (let i = 0; i < program.args.length; i++) {
    let word = program.args[i].replace(/ /g, '_');

    // remove extension '.mp3 or .wav' if any
    let reg = /\.(mp3|wav)$/;
    if (word.length > 4 && reg.test(word) === true) {
      word = word.slice(0, -4);
    }

    let audio = null;
    try {
      audio = yield getAudio(word, config.directory, service);
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e;
      }
    }

    if (audio === null) {
      console.log(`'${word}' is not found${service ? ' from ' + service : ''}`);
      continue;
    }

    console.log(`play '${path.basename(audio)}' ...`);
    yield exec(`${config.audio_cli} "${audio}"`);
  }
});
