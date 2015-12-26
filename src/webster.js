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
    var res = yield fetch(url);
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
      var file = ele.attr('data-file');

      if (map.hasOwnProperty(file) === false) {
        map[file] = true;
        list.push({
          file: file,
          lang: ele.attr('data-lang'),
          dir: ele.attr('data-dir')
        });
      }
    });

    if (list.length === 0) {
      var err = new Error(word + ' is not found from webster');
      err.code = 'ENOENT';
      throw err;
    }

    // return the first audio from list
    var file = list[0].file;
    var lang = list[0].lang;
    var dir  = list[0].dir;
    return 'http://media.merriam-webster.com/audio/prons/' + lang.replace(/_/g, '/') + '/mp3/' + dir + '/' + file + '.mp3';
  });
}
