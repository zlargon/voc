var Promise = require('promise');
var fetch   = require('node-fetch');
var cheerio = require('cheerio');

module.exports = function webster (word) {
  if (typeof word !== 'string') {
    return Promise.reject(new TypeError());
  }

  word = word.toLowerCase();
  return fetch('http://www.merriam-webster.com/dictionary/' + word)
    .then(function(res) { return res.text(); })
    .then(function(html) {
      var map = {};
      var list = [];

      var $ = cheerio.load(html);
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

      return list;
    })
    .then(list => {
      var file = list[0].file;
      var lang = list[0].lang;
      var dir  = list[0].dir;
      return 'http://media.merriam-webster.com/audio/prons/' + lang.replace(/_/g, '/') + '/mp3/' + dir + '/' + file + '.mp3';
    });
}
