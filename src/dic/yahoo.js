var util      = require('util');
var coroutine = require('co');
var fetch     = require('node-fetch');
var cheerio   = require('cheerio');

module.exports = coroutine.wrap(function * (word) {
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

  var map = {};
  var list = [];
  try {
    var data = $('#iconStyle.tri').text();
    JSON.parse(data).sound_url_1.forEach(function (item) {
      var audio = item.mp3;
      if (typeof audio !== 'string' || map.hasOwnProperty(audio) === true) {
        return;
      }

      map[audio] = true;
      list.push(audio);
    });
  } catch (e) {
    // JSON parse failed
  }

  if (list.length === 0) {
    var err = new Error(word + ' is not found from yahoo');
    err.code = 'ENOENT';
    throw err;
  }

  // show all the audio url
  if (list.length > 1) {
    list.forEach(function (audio, i) {
      i++;
      console.log(i + '. ' + audio);
    });
  }

  // return the first audio from list
  return list[0];
});
