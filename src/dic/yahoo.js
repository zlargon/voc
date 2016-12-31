'use strict';
const _async_   = require('co').wrap;
const fetch     = require('node-fetch');
const cheerio   = require('cheerio');
const normalize = require('../lib/normalize');
const urlformat = require('url').format;

module.exports = _async_(function * (word) {
  word = normalize(word);

  const url = 'https://tw.dictionary.search.yahoo.com/search' + urlformat({
    query: {
      fr2: 'dict',
      p: word
    }
  });
  const res = yield fetch(url, { timeout: 10 * 1000 });
  if (res.status !== 200) {
    throw new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
  }

  const html = yield res.text();
  const $ = cheerio.load(html);

  // check the word from title
  const term = $('#term').text().trim().toLowerCase().replace(/·/g, '');
  if (term !== word) {
    let msg = `'${word}' is not found from yahoo`;
    if (term !== '') {
      msg += `. Do you mean the word '${term}' ?`;
    }

    const err = new Error(msg);
    err.code = 'ENOENT';
    throw err;
  }

  const set = {};
  JSON.parse($('#iconStyle.tri').text()).sound_url_1.forEach(item => {
    if ('mp3' in item) {
      set[item.mp3] = true;
    }
  });

  const list = Object.keys(set);
  if (list.length === 0) {
    const err = new Error(`'${word}' has no audio from yahoo`);
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
