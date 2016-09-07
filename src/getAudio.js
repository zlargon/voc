'use strict';
require('babel-polyfill');

const _async_   = require('co').wrap;
const fs        = require('fs');
const path      = require('path');
const download  = require('./lib/download');
const normalize = require('./lib/normalize');
const Service   = require('./service');

function getAudioFileName(word, ext) {
  // only convert ' ' to '_' here
  return word.replace(/ /g, '_') + (ext ? ext : '');
}

function getExistAudio (word, directory) {
  // word.mp3, word.xxx.mp3, word.xxx.wav
  word = getAudioFileName(word);
  const regx = new RegExp(`^${word}(\\..+)?\\.(mp3|wav)$`);

  return fs.readdirSync(directory, 'utf8')
           .filter(v => regx.test(v))
           .map(audio => path.resolve(directory, audio));
}

const downloadAudio = _async_(function * (word, directory, serviceName) {
  if (serviceName in Service === false) {
    throw new Error(`Unknown Service '${serviceName}'`);
  }

  const serv = Service[serviceName];
  const url = yield serv.getUrl(word);
  const ext = serv.ext || path.extname(url);
  const audioName = getAudioFileName(word, ext);        // audio_xxx.mp3 or audio_xxx.wav
  const audioDest = path.resolve(directory, audioName); // audio destination

  yield download(url, audioDest);
  console.log(`Download '${audioName}' from ${serviceName} ...`);
  return audioDest;
});

module.exports = _async_(function * (word, directory, service) {

  // only convert '_' to ' ' here
  word = normalize(word).replace(/_/g, ' ');

  // 1. force to download audio from particular service
  if (service) {
    return [yield downloadAudio(word, directory, service)];
  }

  // 2-1. check audio is exist or not
  const audio = getExistAudio(word, directory);
  if (audio.length !== 0) {
    return audio;
  }

  // 2-2. audio is not exist, search audio URL of the word
  for (const serv in Service) {

    // download by 'Dictionary' only,
    // because it can always download audio from 'TTS' successfully even the words are misspell
    if (Service[serv].type !== 'dic') {
      continue;
    }

    try {
      return [yield downloadAudio(word, directory, serv)];
    } catch (e) {

      // unusual error
      if (e.code !== 'ENOENT') {
        throw e;
      }
    }
  }

  // 3. audio is not found
  const err = new Error(`'${word}' is not found`);
  err.code = 'ENOENT';
  throw err;
});
