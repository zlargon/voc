var fetch  = require('node-fetch');
var rewire = require('rewire');
var chai   = require('chai');
var expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

// mock console.log
var voicerss = rewire('../src/tts/voicerss');
voicerss.__set__({
  console: {
    log: function () {}
  }
});

function checkHttpStatus (word) {
  return expect(
    voicerss(word)
      .then(function (url) { return fetch(url) })
      .then(function (res) { return res.status })
  ).to.eventually.equal(200);
}

describe('tts.voicerss', function() {

  it('Hello', function () {
    var word = 'Hello';
    return checkHttpStatus(word);
  });

  it('hello', function () {
    var word = 'hello';
    return checkHttpStatus(word);
  });

  it('hello world', function () {
    var word = 'hello world';
    return checkHttpStatus(word);
  });

  it('Hello_World', function () {
    var word = 'Hello_World';
    return checkHttpStatus(word);
  });

  it('how_are_you', function () {
    var word = 'how_are_you';
    return checkHttpStatus(word);
  });

  it('123', function () {
    var word = '123';
    return checkHttpStatus(word);
  });

  it('(null)', function () {
    var word = null;
    return expect(voicerss(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    var word = 123;
    return expect(voicerss(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(voicerss(word)).to.eventually.be.rejectedWith(TypeError);
  });

});
