'use strict';
const _async_   = require('co').wrap;
const UrlFormat = require('url').format;
const fetch     = require('node-fetch');
const normalize = require('../lib/normalize');
const HOST      = 'https://translate.google.com';

function XL (a, b) {
  for (var c = 0; c < b.length - 2; c += 3) {
    var d = b.charAt(c + 2);
    d = d >= 'a' ? d.charCodeAt(0) - 87 : Number(d);
    d = b.charAt(c + 1) == '+' ? a >>> d : a << d;
    a = b.charAt(c) == '+' ? a + d & 4294967295 : a ^ d;
  }
  return a;
}

/**
 * Generate API Token
 *
 * @param   {String} text
 * @param   {String} key
 * @return  {String} token
 */
function token (text, key) {
  var a = text, b = key, d = b.split('.');
  b = Number(d[0]) || 0;
  for (var e = [], f = 0, g = 0; g < a.length; g++) {
    var m = a.charCodeAt(g);
    128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
    e[f++] = m >> 18 | 240,
    e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
    e[f++] = m >> 6 & 63 | 128),
    e[f++] = m & 63 | 128);
  }
  a = b;
  for (f = 0; f < e.length; f++) {
    a += e[f];
    a = XL(a, '+-a^+6');
  }
  a = XL(a, '+-3^+b+-f');
  a ^= Number(d[1]) || 0;
  0 > a && (a = (a & 2147483647) + 2147483648);
  a = a % 1E6;
  return a.toString() + '.' + (a ^ b);
}

const key = _async_(function * () {
  const res = yield fetch(HOST, {
    timeout: 10 * 1000
  });
  if (res.status !== 200) {
    throw new Error(`request to ${HOST} failed, status code = ${res.status} (${res.statusText})`);
  }

  let TKK = null;
  const html = yield res.text();
  try {
    eval(html.match(/TKK=eval\(\'\(.*\)\'\);/g)[0]);  // TKK = '405291.1334555331'
    if (TKK === null) throw null;
  } catch (e) {
    throw new Error('get key failed from google');
  }

  return TKK;
});

module.exports = _async_(function * (word) {
  word = normalize(word);

  return HOST + '/translate_tts' + UrlFormat({
    query: {
      ie: 'UTF-8',
      q: word,    // encodeURIComponent
      tl: 'en',
      total: 1,
      idx: 0,
      textlen: word.length,
      tk: token(word, yield key()),
      client: 't',
      prev: 'input',
      ttsspeed: 1   // slow = 0.24
    }
  });
});
