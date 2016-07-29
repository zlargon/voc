'use strict';
const _async_   = require('co').wrap;
const fetch     = require('node-fetch');
const cheerio   = require('cheerio');
const normalize = require('../lib/normalize');
const urlformat = require('url').format;

// 1. search word
const isWordExist = _async_(function * (word) {
  const url = 'https://tw.search.yahoo.com/sugg/gossip/gossip-tw-vertical_ss/' + urlformat({
    query: {
      pubid: '1306',
      output: 'sd1',
      f: '1',
      '.crumb': 'mAARUl2TmE0',
      command: word
    }
  });
  const res = yield fetch(url, {
    headers: {
      "Cookie": "T=z=KuukXBKCWpXBaugL8Wr7rLEMDI3BjQ2NzEzNjdPMDA-&sk=DAAGuIb1qb7zgz&ks=EAAlPXuNq8nIsIWYM2IVdWHyQ--~E&d=c2wBTnpVd0FUTXhNRFkwTVRBNE56Yy0BYQFZQUUBZwFRMjZNWk5LUVdNNEZXTzNZUU9BRDROQ0taUQFzY2lkAVdsZ2RjVjJnWnFYemhsd2huM2VMMk5sODgzcy0BYWMBQUhJQTdEbTIBb2sBWlcwLQF0aXABQmdxS3NBAXNjAWRlc2t0b3Bfd2ViAWZzAXVKYmkyUWRXd1ZfeQF6egFLdXVrWEJBN0U-; Y=v=1&n=68ljhbicmoc7o&l=pb0h6ed/o&r=a8;"
    },
    timeout: 10 * 1000
  });
  if (res.status !== 200) {
    throw new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
  }

  const list = [];
  const data = yield res.json();
  data.r.forEach(item => {
    if ('k' in item) {
      list.push(item.k.toLowerCase());
    }
  });

  // word is exist or not
  return list.indexOf(word) >= 0;
});

// 2. get audio list
const getAudioList = _async_(function * (word) {
  const url = 'http://tw.dictionary.search.yahoo.com/search' + urlformat({
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

module.exports = _async_(function * (word) {
  word = normalize(word);

  if (yield isWordExist(word)) {
    return getAudioList(word);
  }

  const err = new Error(`'${word}' is not found from yahoo`);
  err.code = 'ENOENT';
  throw err;
});
