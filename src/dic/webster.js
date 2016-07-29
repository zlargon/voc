'use strict';
const _async_   = require('co').wrap;
const fetch     = require('node-fetch');
const cheerio   = require('cheerio');
const normalize = require('../lib/normalize');

module.exports = _async_(function * (word) {
  word = normalize(word);

  const url = 'http://www.merriam-webster.com/dictionary/' + word;
  const res = yield fetch(url, { timeout: 10 * 1000 });
  if (res.status !== 200) {
    throw new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
  }

  const set = {};
  const html = yield res.text();
  const $ = cheerio.load(html);
  $('.play-pron').each((index, element) => {
    const ele = $(element);
    const term = ele.prev().text().toLowerCase();
    const lang = ele.attr('data-lang').replace(/_/g, '/');
    const dir  = ele.attr('data-dir');
    const file = ele.attr('data-file');
    const audio = `http://media.merriam-webster.com/audio/prons/${lang}/mp3/${dir}/${file}.mp3`;
    if (word === term) {
      set[audio] = true;
    }
  });

  const list = Object.keys(set);
  if (list.length === 0) {
    const err = new Error(`'${word}' is not found from webster`);
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
