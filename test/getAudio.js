var fs             = require('fs');
var path           = require('path');
var exec           = require('child_process').execSync;
var chai           = require('chai');
var chaiAsPromised = require('chai-as-promised');
var getAudio       = require('../src/getAudio');
var expect         = chai.expect;

// setup promise
chai.use(chaiAsPromised);

var removeAudioCommand = 'rm -f ' + __dirname + '/*.mp3 ' + __dirname + '/*.wav';

describe('Get Audio', function() {
  before(function () {
    exec(removeAudioCommand);
  });

  after(function () {
    exec(removeAudioCommand);
  });

  it('test', function () {
    this.timeout(10000);
    var word = 'test';
    return expect(getAudio(word, __dirname)).to.eventually.equal(
      path.resolve(__dirname, 'test.mp3')
    );
  });

  it('Hello', function () {
    this.timeout(10000);
    var word = 'Hello';
    return expect(getAudio(word, __dirname)).to.eventually.equal(
      path.resolve(__dirname, 'hello.mp3')
    );
  });

  it('hello (Audio is already exist, so it should return immediately)', function () {
    this.timeout(100);
    var word = 'hello';
    return expect(getAudio(word, __dirname)).to.eventually.equal(
      path.resolve(__dirname, 'hello.mp3')
    );
  });

  it('askdjalksjdl', function () {
    this.timeout(10000);
    var word = 'askdjalksjdl';
    return expect(getAudio(word, __dirname)).to.eventually.be.rejected;
  });

  it('(null)', function () {
    this.timeout(100);
    var word = null;
    return expect(getAudio(word, __dirname)).to.eventually.be.rejected;
  });

  it('123 (number)', function () {
    this.timeout(100);
    var word = 123;
    return expect(getAudio(word, __dirname)).to.eventually.be.rejected;
  });

  it('123 (string)', function () {
    this.timeout(10000);
    var word = '123';
    return expect(getAudio(word, __dirname)).to.eventually.be.rejected;
  });

});
