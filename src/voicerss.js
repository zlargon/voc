var UrlFormat = require('url').format;

module.exports = function voicerss (word) {
  if (typeof word !== 'string' || word.length === 0) {
    return Promise.reject(new TypeError('word should be a string'));
  }

  // replace '_' to ' ', and convert to lower case
  word = word.replace(/_/g, ' ').toLowerCase();
  var url = UrlFormat({
    protocol: 'http',
    host: 'www.voicerss.org/controls/speech.ashx',
    query: {
      hl: 'en-us',
      src: word,
      c: 'mp3',
      // rnd: Math.random()
    }
  });

  return Promise.resolve(url);
}
