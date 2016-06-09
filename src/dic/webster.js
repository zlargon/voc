'use strict';
const fetch   = require('node-fetch');
const cheerio = require('cheerio');
const resolve = require('url').resolve;

module.exports = async function (word) {
  const HOST = 'http://www.merriam-webster.com';

  if (typeof word !== 'string' || word.length === 0) {
    throw new TypeError('word should be a string');
  }

  // replace '_' to ' ', and convert to lower case
  word = word.replace(/_/g, ' ').toLowerCase();
  const url = `${HOST}/autocomplete?term=${word}&ref=dictionary`;
  const res = await fetch(url, {
    timeout: 10 * 1000
  });
  if (res.status !== 200) {
    let err = new Error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
    err.code = 'ENOENT';
    throw err;
  }
  const urlList = (await res.json()).reduce((arr, item) => {
    if (item.label.toLowerCase() === word) {
      // link: "/dictionary/sherry"
      // link: "http://www.spanishcentral.com/translate/sherry"
      const link = resolve(HOST, item.link);
      arr.push(link);
    }
    return arr;
  }, []);

  let map = {};
  for (let i = 0; i < urlList.length; i++) {
    const url = urlList[i];
    const res = await fetch(url, {
      timeout: 10 * 1000
    });
    if (res.status !== 200) {
      console.error(`request to ${url} failed, status code = ${res.status} (${res.statusText})`);
      continue;
    }

    const $ = cheerio.load(await res.text());
    $('.word-and-pronunciation .play-pron').each((index, element) => {
      const ele = $(element);
      const lang = ele.attr('data-lang').replace(/_/g, '/');
      const dir  = ele.attr('data-dir');
      const file = ele.attr('data-file');
      const audio = `http://media.merriam-webster.com/audio/prons/${lang}/mp3/${dir}/${file}.mp3`;

      if (map.hasOwnProperty(audio) === false) {
        map[audio] = true;
      }
    });
  }

  const list = Object.keys(map);
  if (list.length === 0) {
    let err = new Error(word + ' is not found from webster');
    err.code = 'ENOENT';
    throw err;
  }

  // show all the audio url
  if (list.length > 1) {
    list.forEach((audio, i) => {
      console.log(`${i+1}. ${audio}`);
    });
  }

  // return the first audio from list
  return list[0];
};
