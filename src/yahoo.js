var Promise = require('promise');
var fetch   = require('node-fetch');
var cheerio = require('cheerio');

module.exports = function yahoo (word) {
  var HOST = 'http://tw.dictionary.search.yahoo.com';
  if (typeof word !== 'string') {
    return Promise.reject(new TypeError());
  }

  word = word.toLowerCase();
  return fetch(HOST + '/search?p=' + word + '&fr2=dict')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      var $ = cheerio.load(html);
      return $('#iconStyle.tri').text();
    })
    .then(function(data) {
      return JSON.parse(data).sound_url_1[0].mp3;
    });
}
