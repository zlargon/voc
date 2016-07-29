'use strict';
const _async_    = require('co').wrap;
const fetch      = require('node-fetch');
const cheerio    = require('cheerio');
const urlformat  = require('url').format;
const urlresolve = require('url').resolve;
const normalize  = require('../lib/normalize');
const HOST       = 'http://www.merriam-webster.com';

// 1. search url set
const searchUrlSet = _async_(function * (word) {
  const url = HOST + '/autocomplete' + urlformat({
    query: {
      ref: 'dictionary',
      term: word
    }
  });
  const res = yield fetch(url, { timeout: 10 * 1000 });
  if (res.status !== 200) {
    throw new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
  }

  /* Response Body:
   *
   * [{
   *   "ref": "dictionary",
   *   "term": "sherry",
   *   "category": "Dictionary",
   *   "label": "sherry",
   *   "link": "/dictionary/sherry",
   *   "show_cat": false,
   *   "alsoIn": []
   * }, {
   *   "ref": "dictionary",
   *   "term": "sherry",
   *   "category": "English",
   *   "label": "sherry",
   *   "link": "http://www.spanishcentral.com/translate/sherry",
   *   "show_cat": true,
   *   "alsoIn": []
   * }, {
   *   "ref": "dictionary",
   *   "term": "sherry",
   *   "category": "Scrabble",
   *   "label": "sherry",
   *   "link": "http://scrabble.merriam.com/finder/sherry",
   *   "show_cat": true,
   *   "alsoIn": []
   * }]
   */

  const set = {};
  const list = yield res.json();
  list.forEach(item => {
    if (item.category === 'Dictionary' && item.label.toLowerCase() === word) {
      const link = urlresolve(HOST, item.link);
      set[link] = true;
    }
  });

  return set;
});

// 2. get audio set
const getAudioSet = _async_(function * (originWord, wordUrl) {
  const res = yield fetch(wordUrl, { timeout: 10 * 1000 });
  if (res.status !== 200) {
    throw new Error(`request to ${wordUrl} failed, status code = ${res.status} (${res.statusText})`);
  }

  const set = {};
  const html = yield res.text();
  const $ = cheerio.load(html);
  $('.play-pron').each((index, element) => {
    const ele = $(element);
    const word = ele.prev().text().toLowerCase();
    const lang = ele.attr('data-lang').replace(/_/g, '/');
    const dir  = ele.attr('data-dir');
    const file = ele.attr('data-file');
    const audio = `http://media.merriam-webster.com/audio/prons/${lang}/mp3/${dir}/${file}.mp3`;
    if (word === originWord) {
      set[audio] = true;
    }
  });

  return set;
});

module.exports = _async_(function * (word) {
  word = normalize(word);

  const urlSet = yield searchUrlSet(word);
  if (Object.keys(urlSet).length === 0) {
    const err = new Error(`'${word}' is not found from webster`);
    err.code = 'ENOENT';
    throw err;
  }

  const set = {};
  for (const url in urlSet) {
    Object.assign(set, yield getAudioSet(word, url));
  }

  const list = Object.keys(set);
  if (list.length === 0) {
    const err = new Error(`'${word}' has no audio from webster`);
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
