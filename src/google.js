var UrlFormat = require('url').format;
var coroutine = require('co');
var fetch     = require('node-fetch');
var cheerio   = require('cheerio');

function token (str, key) {
  function RL(num, str) {
    for (var i = 0; i < str.length - 2; i += 3) {
      var d = str.charAt(i + 2);
      d = d >= 'a' ? d.charCodeAt(0) - 87 : Number(d);
      d = str.charAt(i + 1) === '+' ? num >>> d : num << d;
      num = str.charAt(i) === '+' ? num + d & 4294967295 : num ^ d;
    }
    return num;
  }

  var num = key;
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    num = RL(num + code, '+-a^+6');
  }
  num = RL(num, '+-3^+b+-f');
  0 > num && (num = (num & 2147483647) + 2147483648);
  num %= 1E6;

  return num.toString() + '.' + (num ^ key);
};

module.exports = function google (word) {
  return coroutine(function * () {
    if (typeof word !== 'string' || word.length === 0) {
      throw TypeError('word should be a string');
    }

    // replace '_' to ' ', and convert to lower case
    word = word.replace(/_/, ' ').toLowerCase();

    var HOST = 'https://translate.google.com';
    var res = yield fetch(HOST);
    if (res.status !== 200) {
      throw new Error('request to ' + url + ' failed, status code = ' + res.status + ' (' + res.statusText + ')');
    }

    var html = yield res.text();
    var $ = cheerio.load(html);
    var scripts = $('#gt-c script').text().split(';');

    // get key
    var key = null;
    for (var i = 0; i < scripts.length; i++) {
      var code = scripts[i];
      if (code.match(/^TKK='\d*'$/)) {
        eval('var ' + code);   // var TKK = '123456'
        key = parseInt(TKK, 10);
        break;
      }
    }

    if (key === null) {
      throw new Error('key is not found');
    }

    var querystring = UrlFormat({
      query: {
        ie: 'UTF-8',
        q: word,    // encodeURIComponent
        tl: 'en',
        total: 1,
        idx: 0,
        textlen: word.length,
        tk: token(word, key),
        client: 't',
        prev: 'input',
        ttsspeed: 1   // slow = 0.24
      }
    });

    return HOST + '/translate_tts' + querystring;
  });
}
