var chai           = require('chai');
var chaiAsPromised = require('chai-as-promised');
var voicetube      = require('../src/voicetube');
var expect         = chai.expect;

// setup promise
chai.use(chaiAsPromised);

describe('VoiceTube', function() {

  it('Hello', function () {
    var word = 'Hello';
    return expect(voicetube(word)).to.eventually.equal(
      'https://tw.voicetube.com/player/hello.mp3'
    );
  });

  it('test', function () {
    var word = 'test';
    return expect(voicetube(word)).to.eventually.equal(
      'https://tw.voicetube.com/player/test.mp3'
    );
  });

  it('askdjalksjdl', function () {
    var word = 'askdjalksjdl';
    return expect(voicetube(word)).to.eventually.be.rejected;
  });

  it('(null)', function () {
    var word = null;
    return expect(voicetube(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    var word = 123;
    return expect(voicetube(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (string)', function () {
    var word = '123';
    return expect(voicetube(word)).to.eventually.be.rejected;
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(voicetube(word)).to.eventually.be.rejectedWith(TypeError);
  });

});
