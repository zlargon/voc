'use strict';
const _async_   = require('co').wrap;
const UrlFormat = require('url').format;
const normalize = require('../lib/normalize');

module.exports = _async_(function * (word) {
  word = normalize(word);

  return UrlFormat({
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
