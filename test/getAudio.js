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

  it('testing (from webster)', function () {
    this.timeout(10000);
    var word = 'testing';
    return expect(getAudio(word, __dirname, 'webster')).to.eventually.be.rejected;
  });

  it('testing (from google)', function () {
    this.timeout(10000);
    var word = 'testing';
    return expect(getAudio(word, __dirname, 'google')).to.eventually.equal(
      path.resolve(__dirname, 'testing.mp3')
    );
  });

  it('Hello_World (from google)', function () {
    this.timeout(10000);
    var word = 'Hello_World';
    return expect(getAudio(word, __dirname, 'google')).to.eventually.equal(
      path.resolve(__dirname, 'hello_world.mp3')
    );
  });

  it('great (from ispeech)', function () {
    this.timeout(10000);
    var word = 'great';
    return expect(getAudio(word, __dirname, 'ispeech')).to.eventually.equal(
      path.resolve(__dirname, 'great.mp3')
    );
  });

  it('Have_A_Nice_Day (from ispeech)', function () {
    this.timeout(10000);
    var word = 'Have_A_Nice_Day';
    return expect(getAudio(word, __dirname, 'ispeech')).to.eventually.equal(
      path.resolve(__dirname, 'have_a_nice_day.mp3')
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
    return expect(getAudio(word, __dirname)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    this.timeout(100);
    var word = 123;
    return expect(getAudio(word, __dirname)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (string)', function () {
    this.timeout(10000);
    var word = '123';
    return expect(getAudio(word, __dirname)).to.eventually.be.rejected;
  });

  it('(Empty String)', function () {
    this.timeout(10000);
    var word = '';
    return expect(getAudio(word, __dirname)).to.eventually.be.rejectedWith(TypeError);
  });

});
