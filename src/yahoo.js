var util      = require('util');
var coroutine = require('co');
var fetch     = require('node-fetch');
var cheerio   = require('cheerio');

module.exports = function yahoo (word) {
  return coroutine(function * () {
    if (typeof word !== 'string' || word.length === 0) {
      throw new TypeError('word should be a string');
    }

    // replace '_' to ' ', and convert to lower case
    word = word.replace(/_/g, ' ').toLowerCase();

    var url = 'http://tw.dictionary.search.yahoo.com/search?p=' + word + '&fr2=dict';
    var res = yield fetch(url, {
      timeout: 10 * 1000
    });
    if (res.status !== 200) {
      var msg = util.format('request to %s failed, status code = %d (%s)', url, res.status, res.statusText);
      throw new Error(msg);
    }

    var html = yield res.text();
    var $ = cheerio.load(html);
    var data = $('#iconStyle.tri').text();

    var audios;
    try {
      audios = JSON.parse(data).sound_url_1.reduce(function (list, item) {
        if (typeof item.mp3 === 'string') {
          list.push(item.mp3);
        }
        return list;
      }, []);

      if (audios.length === 0) {
        throw null;  // not found
      }
    } catch (e) {
      var err = new Error(word + ' is not found from yahoo');
      err.code = 'ENOENT';
      throw err;
    }

    // show all the audio url
    if (audios.length > 1) {
      audios.forEach(function (audio, i) {
        i++;
        console.log(i + '. ' + audio);
      });
    }

    // return the first audio from list
    return audios[0];
  });
}
