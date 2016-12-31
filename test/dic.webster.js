var fetch  = require('node-fetch');
var rewire = require('rewire');
var chai   = require('chai');
var expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

// mock console.log
var webster = rewire('../src/dic/webster');
webster.__set__({
  console: {
    log: function () {}
  }
});

function checkHttpStatus (word) {
  return expect(
    webster(word)
      .then(function (url) { return fetch(url) })
      .then(function (res) { return res.status })
  ).to.eventually.equal(200);
}

describe('dic.webster', function() {

  it('Hello', function () {
    var word = 'Hello';
    return checkHttpStatus(word);
  });

  it('test', function () {
    var word = 'test';
    return checkHttpStatus(word);
  });

  it('affiliate', function () {
    var word = 'affiliate';
    return checkHttpStatus(word);
  });

  it('artesian well', function () {
    var word = 'artesian well';
    var url = 'https://media.merriam-webster.com/audio/prons/en/us/mp3/a/artesi01.mp3';
    return expect(webster(word)).to.eventually.equal(url);
  });

  it('projectable (not from title)', function () {
    var word = 'projectable';
    var url = 'https://media.merriam-webster.com/audio/prons/en/us/mp3/p/projec03.mp3';
    return expect(webster(word)).to.eventually.equal(url);
  });

  it('askdjalksjdl', function () {
    var word = 'askdjalksjdl';
    return expect(webster(word)).to.eventually.be.rejected;
  });

  it('(null)', function () {
    var word = null;
    return expect(webster(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    var word = 123;
    return expect(webster(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (string)', function () {
    var word = '123';
    return expect(webster(word)).to.eventually.be.rejected;
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(webster(word)).to.eventually.be.rejectedWith(TypeError);
  });

});
