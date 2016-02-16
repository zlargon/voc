var rewire = require('rewire');
var chai   = require('chai');
var expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

var ispeech = rewire('../src/tts/ispeech');
describe('tts.ispeech', function() {

  before(function () {
    // mock console.log
    ispeech.__set__({
      console: {
        log: function () {}
      }
    });
  });

  it('Hello', function () {
    var word = 'Hello';
    return expect(ispeech(word)).to.eventually.equal(
      'http://api.ispeech.org/api/rest?format=mp3&action=convert&apikey=59e482ac28dd52db23a22aff4ac1d31e&voice=usenglishmale&speed=0&text=hello'
    );
  });

  it('hello', function () {
    var word = 'hello';
    return expect(ispeech(word)).to.eventually.equal(
      'http://api.ispeech.org/api/rest?format=mp3&action=convert&apikey=59e482ac28dd52db23a22aff4ac1d31e&voice=usenglishmale&speed=0&text=hello'
    );
  });

  it('hello world', function () {
    var word = 'hello world';
    return expect(ispeech(word)).to.eventually.equal(
      'http://api.ispeech.org/api/rest?format=mp3&action=convert&apikey=59e482ac28dd52db23a22aff4ac1d31e&voice=usenglishmale&speed=0&text=hello%20world'
    );
  });

  it('Hello_World', function () {
    var word = 'Hello_World';
    return expect(ispeech(word)).to.eventually.equal(
      'http://api.ispeech.org/api/rest?format=mp3&action=convert&apikey=59e482ac28dd52db23a22aff4ac1d31e&voice=usenglishmale&speed=0&text=hello%20world'
    );
  });

  it('how_are_you', function () {
    var word = 'how_are_you';
    return expect(ispeech(word)).to.eventually.equal(
      'http://api.ispeech.org/api/rest?format=mp3&action=convert&apikey=59e482ac28dd52db23a22aff4ac1d31e&voice=usenglishmale&speed=0&text=how%20are%20you'
    );
  });

  it('123', function () {
    var word = '123';
    return expect(ispeech(word)).to.eventually.equal(
      'http://api.ispeech.org/api/rest?format=mp3&action=convert&apikey=59e482ac28dd52db23a22aff4ac1d31e&voice=usenglishmale&speed=0&text=123'
    );
  });

  it('(null)', function () {
    var word = null;
    return expect(ispeech(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    var word = 123;
    return expect(ispeech(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(ispeech(word)).to.eventually.be.rejectedWith(TypeError);
  });

});
