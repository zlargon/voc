'use strict';
const urlformat = require('url').format;
const normalize = require('../lib/normalize');

module.exports = (word) => new Promise(resolve => {
  word = normalize(word);

  const url = urlformat({
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

  resolve(url);
});
