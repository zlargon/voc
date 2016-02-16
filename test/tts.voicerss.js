var rewire = require('rewire');
var chai   = require('chai');
var expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

var voicerss = rewire('../src/tts/voicerss');
describe('tts.voicerss', function() {

  before(function () {
    // mock console.log
    voicerss.__set__({
      console: {
        log: function () {}
      }
    });
  });

  it('Hello', function () {
    var word = 'Hello';
    return expect(voicerss(word)).to.eventually.equal(
      'http://www.voicerss.org/controls/speech.ashx?hl=en-us&src=hello&c=mp3'
    );
  });

  it('hello', function () {
    var word = 'hello';
    return expect(voicerss(word)).to.eventually.equal(
      'http://www.voicerss.org/controls/speech.ashx?hl=en-us&src=hello&c=mp3'
    );
  });

  it('hello world', function () {
    var word = 'hello world';
    return expect(voicerss(word)).to.eventually.equal(
      'http://www.voicerss.org/controls/speech.ashx?hl=en-us&src=hello%20world&c=mp3'
    );
  });

  it('Hello_World', function () {
    var word = 'Hello_World';
    return expect(voicerss(word)).to.eventually.equal(
      'http://www.voicerss.org/controls/speech.ashx?hl=en-us&src=hello%20world&c=mp3'
    );
  });

  it('how_are_you', function () {
    var word = 'how_are_you';
    return expect(voicerss(word)).to.eventually.equal(
      'http://www.voicerss.org/controls/speech.ashx?hl=en-us&src=how%20are%20you&c=mp3'
    );
  });

  it('123', function () {
    var word = '123';
    return expect(voicerss(word)).to.eventually.equal(
      'http://www.voicerss.org/controls/speech.ashx?hl=en-us&src=123&c=mp3'
    );
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
