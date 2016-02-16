var rewire = require('rewire');
var chai   = require('chai');
var expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

var webster = rewire('../src/dic/webster');
describe('dic.webster', function() {

  before(function () {
      // mock console.log
      webster.__set__({
        console: {
          log: function () {}
        }
      });
    });

  it('Hello', function () {
    this.timeout(10000);
    var word = 'Hello';
    return expect(webster(word)).to.eventually.equal(
      'http://media.merriam-webster.com/audio/prons/en/us/mp3/h/hello001.mp3'
    );
  });

  it('test', function () {
    this.timeout(10000);
    var word = 'test';
    return expect(webster(word)).to.eventually.equal(
      'http://media.merriam-webster.com/audio/prons/en/us/mp3/t/test0001.mp3'
    );
  });

  it('affiliate', function () {
    this.timeout(10000);
    var word = 'affiliate';
    return expect(webster(word)).to.eventually.equal(
      'http://media.merriam-webster.com/audio/prons/en/us/mp3/a/affili01.mp3'
    );
  });

  it('askdjalksjdl', function () {
    this.timeout(10000);
    var word = 'askdjalksjdl';
    return expect(webster(word)).to.eventually.be.rejected;
  });

  it('(null)', function () {
    this.timeout(10000);
    var word = null;
    return expect(webster(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    this.timeout(10000);
    var word = 123;
    return expect(webster(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (string)', function () {
    this.timeout(10000);
    var word = '123';
    return expect(webster(word)).to.eventually.be.rejected;
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(webster(word)).to.eventually.be.rejectedWith(TypeError);
  });

});
