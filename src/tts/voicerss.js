'use strict';
const urlformat = require('url').format;
const normalize = require('../lib/normalize');

module.exports = (word) => new Promise(resolve => {
  word = normalize(word);

  const url = urlformat({
    protocol: 'http',
    host: 'www.voicerss.org/controls/speech.ashx',
    query: {
      hl: 'en-us',
      src: word,
      c: 'mp3'
      // rnd: Math.random()
    }
  });

  resolve(url);
});
