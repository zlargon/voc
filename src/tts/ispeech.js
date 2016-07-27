'use strict';
const _async_   = require('co').wrap;
const UrlFormat = require('url').format;
const normalize = require('../lib/normalize');

module.exports = _async_(function * (word) {
  word = normalize(word);

  return UrlFormat({
    protocol: 'http',
    host: 'api.ispeech.org/api/rest',
    query: {
      format: 'mp3',
      action: 'convert',
      apikey: '59e482ac28dd52db23a22aff4ac1d31e',
      voice: 'usenglishmale',
      speed: 0,
      text: word
    }
  });
});
