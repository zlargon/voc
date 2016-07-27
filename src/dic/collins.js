'use strict';
const _async_   = require('co').wrap;
const fetch     = require('node-fetch');
const cheerio   = require('cheerio');
const normalize = require('../lib/normalize');
const HOST      = 'http://www.collinsdictionary.com';

// 1. search word
const isWordExist = _async_(function * (word) {
  const url = `${HOST}/autocomplete/?dictCode=english&q=${word}`;
  const res = yield fetch(url, { timeout: 10 * 1000 });
  if (res.status !== 200) {
    throw new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
  }

  const list = yield res.json();
  for (let i = 0; i < list.length; i++) {
    if (list[i] === word) {
      return true;
    }
  }
  return false;
});

// 2. get audio list
const getAudioList = _async_(function * (word) {
  const url = `${HOST}/dictionary/english/${word.replace(/ /g, '-')}`;
  const res = yield fetch(url, { timeout: 10 * 1000 });
  if (res.status !== 200) {
    throw new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
  }

  // parse HTML
  const $ = cheerio.load(yield res.text());

  const set = {};
  $('a.hwd_sound').each(function (index, ele) {
    const audio = HOST + $(ele).attr('data-src-mp3');
    if (audio in set === false) {
      set[audio] = true;
    }
  });

  const list = Object.keys(set);
  if (list.length === 0) {
    const err = new Error(`'${word}' has no audio from collins`);
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

  const err = new Error(`${word} is not found from collins`);
  err.code = 'ENOENT';
  throw err;
});
