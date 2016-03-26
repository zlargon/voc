var util      = require('util');
var UrlFormat = require('url').format;
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
    num = RL(num + str.charCodeAt(i), '+-a^+6');
  }
  num = RL(num, '+-3^+b+-f');
  0 > num && (num = (num & 2147483647) + 2147483648);
  num %= 1E6;

  return num.toString() + '.' + (num ^ key);
}

module.exports = async function (word) {
  if (typeof word !== 'string' || word.length === 0) {
    throw new TypeError('word should be a string');
  }

  // replace '_' to ' ', and convert to lower case
  word = word.replace(/_/g, ' ').toLowerCase();

  var HOST = 'https://translate.google.com';
  var res = await fetch(HOST, {
    timeout: 10 * 1000
  });
  if (res.status !== 200) {
    var msg = util.format('request to %s failed, status code = %d (%s)', HOST, res.status, res.statusText);
    throw new Error(msg);
  }

  var $ = cheerio.load(await res.text());
  var scripts = $('#gt-c script').text();

  // get key
  var TKK, key = NaN;
  var code = scripts.match(/TKK=eval\(\'\(.*\)\'\);/g)[0];
  eval(code);
  key = parseFloat(TKK);

  if (isNaN(key) === true) {
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
};
