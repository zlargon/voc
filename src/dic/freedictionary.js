'use strict';
const _async_   = require('co').wrap;
const fetch     = require('node-fetch');
const cheerio   = require('cheerio');
const normalize = require('../lib/normalize');
const urlformat = require('url').format;
const HOST      = 'http://www.thefreedictionary.com';

// 1. search word
const isWordExist = _async_(function * (word) {
  let list = [];
  function jsonpParser (data) {
    list = data[1].map(v => v[0]);
  }

  const url = HOST + '/_/search/suggest.ashx' + urlformat({
    query: {
      query: word,
      jsonp: jsonpParser.name
    }
  });
  const res = yield fetch(url, { timeout: 10 * 1000 });
  if (res.status !== 200) {
    throw new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
  }

  // execute jsonp
  eval(yield res.text());

  // word is exist or not
  return list.indexOf(word) >= 0;
});

// 2. get audio list
const getAudioList = _async_(function * (word) {
  const url = `${HOST}/${word}`;
  const res = yield fetch(url, { timeout: 10 * 1000 });
  if (res.status !== 200) {
    throw new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
  }

  const html = yield res.text();
  const $ = cheerio.load(html);

  const set = {};
  $('.snd2').each((index, element) => {
    const reg = /^en\/US\//i;
    const snd = $(element).attr('data-snd');
    if (reg.test(snd)) {
      const audio = `http://img2.tfd.com/pron/mp3/${snd}.mp3`;
      set[audio] = true;
    }
  });

  const list = Object.keys(set);
  if (list.length === 0) {
    const err = new Error(`'${word}' has no audio from freedictionary`);
    err.code = 'ENOENT';
    throw err;
  }

  // show all the audio url
  if (list.length > 1) {
    list.forEach((audio, i) => {
      console.log(`${i + 1}. ${audio}`);
    });
  }

  // return the first audio from list
  return list[0];
});

module.exports = _async_(function * (word) {
  word = normalize(word);

  if (yield isWordExist(word)) {
    return getAudioList(word);
  }

  const err = new Error(`${word} is not found from freedictionary`);
  err.code = 'ENOENT';
  throw err;
});
