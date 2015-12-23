var Promise = require('promise');
var fetch = require('node-fetch');

module.exports = function voicetube (word) {
  const HOST = 'https://tw.voicetube.com';
  if (typeof word !== 'string') {
    return Promise.reject(new TypeError());
  }

  word = word.toLowerCase();
  return fetch(HOST + '/videos/ajax_get_search/word?q=' + word)
    .then(function (res) {
      return res.text();
    })
    .then(function (text) {
      return text.split('\n');
    })
    .then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] === word) {
          return HOST + '/player/' + word + '.mp3';
        }
      }
      return Promise.reject(new Error(word + 'is not found'));
    });
}
