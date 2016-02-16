var rewire = require('rewire');
var chai   = require('chai');
var expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

var yahoo = rewire('../src/dic/yahoo');
describe('dic.yahoo', function() {

  before(function () {
    // mock console.log
    yahoo.__set__({
      console: {
        log: function () {}
      }
    });
  });

  it('Hello', function () {
    var word = 'Hello';
    return expect(yahoo(word)).to.eventually.equal(
      'https://s.yimg.com/tn/dict/dreye/live/f/hello.mp3'
    );
  });

  it('test', function () {
    var word = 'test';
    return expect(yahoo(word)).to.eventually.equal(
      'https://s.yimg.com/tn/dict/dreye/live/f/test.mp3'
    );
  });

  it('cactus', function () {
    var word = 'cactus';
    return expect(yahoo(word)).to.eventually.equal(
      'https://s.yimg.com/tn/dict/dreye/live/m/cactus.mp3'
    );
  });

  it('askdjalksjdl', function () {
    var word = 'askdjalksjdl';
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
