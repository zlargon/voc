var UrlFormat = require('url').format;

module.exports = function ispeech (word) {
  if (typeof word !== 'string' || word.length === 0) {
    return Promise.reject(new TypeError('word should be a string'));
  }

  // replace '_' to ' ', and convert to lower case
  word = word.replace(/_/g, ' ').toLowerCase();
  var url = UrlFormat({
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

  return Promise.resolve(url);
}
