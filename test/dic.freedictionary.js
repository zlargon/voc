var fetch  = require('node-fetch');
var rewire = require('rewire');
var chai   = require('chai');
var expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

// mock console.log
var freedictionary = rewire('../src/dic/freedictionary');
freedictionary.__set__({
  console: {
    log: function () {}
  }
});

function checkHttpStatus (word) {
  return expect(
    freedictionary(word)
      .then(function (url) { return fetch(url) })
      .then(function (res) { return res.status })
  ).to.eventually.equal(200);
}

describe('dic.freedictionary', function() {

  it('Hello', function () {
    var word = 'Hello';
    return checkHttpStatus(word);
  });

  it('test', function () {
    var word = 'test';
    return checkHttpStatus(word);
  });

  it('test case', function () {
    var word = 'test case';
    return expect(freedictionary(word)).to.eventually.be.rejected;
  });

  it('Test-Drive', function () {
    var word = 'Test-Drive';
    return checkHttpStatus(word);
  });

  it('askdjalksjdl', function () {
    var word = 'askdjalksjdl';
    return expect(freedictionary(word)).to.eventually.be.rejected;
  });

  it('(null)', function () {
    var word = null;
    return expect(freedictionary(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    var word = 123;
    return expect(freedictionary(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (string)', function () {
    var word = '123';
    return expect(freedictionary(word)).to.eventually.be.rejected;
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(freedictionary(word)).to.eventually.be.rejectedWith(TypeError);
  });

});
