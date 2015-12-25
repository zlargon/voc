var coroutine = require('co');
var fetch     = require('node-fetch');
var cheerio   = require('cheerio');

module.exports = function yahoo (word) {
  return coroutine(function * () {
    try {
      word = word.toLowerCase();
    } catch (e) {
      throw new TypeError('word should be a string');
    }

    var url = 'http://tw.dictionary.search.yahoo.com/search?p=' + word + '&fr2=dict';
    var res = yield fetch(url);
    if (res.status !== 200) {
      throw new Error('request to ' + url + ' failed, status code = ' + res.status + ' (' + res.statusText + ')');
    }

    var html = yield res.text();
    var $ = cheerio.load(html);
    var data = $('#iconStyle.tri').text();

    try {
      return JSON.parse(data).sound_url_1[0].mp3;
    } catch (e) {
      var err = new Error(word + ' is not found from yahoo');
      err.code = 'ENOENT';
      throw err;
    }
  });
}
