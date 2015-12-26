var coroutine = require('co');
var fetch     = require('node-fetch');

module.exports = function voicetube (word) {
  return coroutine(function * () {
    if (typeof word !== 'string' || word.length === 0) {
      throw TypeError('word should be a string');
    }

    // convert to lower case
    word = word.toLowerCase();

    var HOST = 'https://tw.voicetube.com';
    var url = HOST + '/videos/ajax_get_search/word?q=' + word;
    var res = yield fetch(url);
    if (res.status !== 200) {
      throw new Error('request to ' + url + ' failed, status code = ' + res.status + ' (' + res.statusText + ')');
    }

    // find the word from list
    var list = (yield res.text()).split('\n');
    for (var i = 0; i < list.length; i++) {
      if (list[i] === word) {
        return HOST + '/player/' + word + '.mp3';
      }
    }

    var err = new Error(word + ' is not found from voicetube');
    err.code = 'ENOENT';
    throw err;
  });
}
