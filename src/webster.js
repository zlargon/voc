var util      = require('util');
var coroutine = require('co');
var fetch     = require('node-fetch');
var cheerio   = require('cheerio');

module.exports = function webster (word) {
  return coroutine(function * () {
    if (typeof word !== 'string' || word.length === 0) {
      throw TypeError('word should be a string');
    }

    // convert to lower case
    word = word.toLowerCase();

    var url = 'http://www.merriam-webster.com/dictionary/' + word;
    var res = yield fetch(url, {
      timeout: 10 * 1000
    });
    if (res.status !== 200) {
      var err = new Error(word + ' is not found from webster');
      err.code = 'ENOENT';
      throw err;
    }

    var html = yield res.text();
    var $ = cheerio.load(html);

    var map = {};
    var list = [];
    $('.word-and-pronunciation .play-pron').each(function (index, element) {
      var ele  = $(element);
      var audio = util.format(
        'http://media.merriam-webster.com/audio/prons/%s/mp3/%s/%s.mp3',
        ele.attr('data-lang').replace(/_/g, '/'),
        ele.attr('data-dir'),
        ele.attr('data-file')
      );

      if (map.hasOwnProperty(audio) === false) {
        map[audio] = true;
        list.push(audio);
      }
    });

    if (list.length === 0) {
      var err = new Error(word + ' is not found from webster');
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
}
