'use strict';
const _async_   = require('co').wrap;
const fetch     = require('node-fetch');
const cheerio   = require('cheerio');
const normalize = require('../lib/normalize');
const urlformat = require('url').format;

// 1. search word
const isWordExist = _async_(function * (word) {
  let list = [];
  function jsonpParser (data) {
    list = data[1];
  }

  const url = 'https://tw.search.yahoo.com/sugg/gossip/gossip-tw-vertical_ss/' + urlformat({
    query: {
      pubid: '1306',
      command: word,
      callback: jsonpParser.name
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
  const url = `http://tw.dictionary.search.yahoo.com/search?p=${word}&fr2=dict`;
  const res = yield fetch(url, { timeout: 10 * 1000 });
  if (res.status !== 200) {
    throw new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
  }

  const html = yield res.text();
  const $ = cheerio.load(html);

  const set = {};
  JSON.parse($('#iconStyle.tri').text()).sound_url_1.forEach(item => {
    if ('mp3' in item) {
      set[item.mp3] = true;
    }
  });

  // show all the audio url
  const list = Object.keys(set);
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

  const err = new Error(`${word} is not found from yahoo`);
  err.code = 'ENOENT';
  throw err;
});
