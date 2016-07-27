'use strict';
const _async_   = require('co').wrap;
const urlformat = require('url').format;
const normalize = require('../lib/normalize');

module.exports = _async_(function * (word) {
  word = normalize(word);

  return urlformat({
    protocol: 'http',
    host: 'www.voicerss.org/controls/speech.ashx',
    query: {
      hl: 'en-us',
      src: word,
      c: 'mp3'
      // rnd: Math.random()
    }
  });
});
