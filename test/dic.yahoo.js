var fetch  = require('node-fetch');
var rewire = require('rewire');
var chai   = require('chai');
var expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

// mock console.log
var yahoo = rewire('../src/dic/yahoo');
yahoo.__set__({
  console: {
    log: function () {}
  }
});

function checkHttpStatus (word) {
  return expect(
    yahoo(word)
      .then(function (url) { return fetch(url) })
      .then(function (res) { return res.status })
  ).to.eventually.equal(200);
}

describe('dic.yahoo', function() {

  it('Hello', function () {
    var word = 'Hello';
    return checkHttpStatus(word);
  });

  it('test', function () {
    var word = 'test';
    return checkHttpStatus(word);
  });

  it('cactus', function () {
    var word = 'cactus';
    return checkHttpStatus(word);
  });

  it('ambulocetus', function () {
    var word = 'ambulocetus';
    return checkHttpStatus(word);
  });

  it('ambulocetu (show misspelling tip)', function () {
    var word = 'ambulocetu';
    return expect(yahoo(word)).to.eventually.be.rejected;
  });

  it('askdjalksjdl', function () {
    var word = 'askdjalksjdl';
    return expect(yahoo(word)).to.eventually.be.rejected;
  });

  it('philanthropicminde', function () {
    var word = 'philanthropicminde';
    return expect(yahoo(word)).to.eventually.be.rejected;
  });

  it('(null)', function () {
    var word = null;
    return expect(yahoo(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    var word = 123;
    return expect(yahoo(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (string)', function () {
    var word = '123';
    return expect(yahoo(word)).to.eventually.be.rejected;
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(yahoo(word)).to.eventually.be.rejectedWith(TypeError);
  });

});
