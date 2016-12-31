var fs     = require('fs');
var path   = require('path');
var rewire = require('rewire');
var chai   = require('chai');
var expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

// mock console.log from getAudio
var getAudio = rewire('../src/getAudio');
getAudio.__set__({
  console: {
    log: function () {}
  }
});

function checkAudioAndFile (fileName, word, service) {
  return expect(
    getFirstAudio(word, service)
  ).to.eventually.equal(
    path.resolve(__dirname, fileName)
  );
}

function getFirstAudio (word, service) {
  return getAudio(word, __dirname, service)
    .then(function (audio) { return audio[0] });
}

function removeAudio () {
  fs.readdirSync(__dirname).forEach(function (file) {
    if (/.mp3$/.test(file)) {
      fs.unlinkSync(__dirname + '/' + file);
    }
  });
}

describe('Get Audio', function() {
  before(removeAudio);
  after(removeAudio);

  it('test', function () {
    var word = 'test';
    return checkAudioAndFile('test.mp3', word);
  });

  it('Hello', function () {
    var word = 'Hello';
    return checkAudioAndFile('hello.mp3', word);
  });

  it('hello (Audio is already exist, so it should return immediately)', function () {
    this.timeout(100);
    var word = 'hello';
    return checkAudioAndFile('hello.mp3', word);
  });

  it('testing (from webster)', function () {
    var word = 'testing';
    return expect(getFirstAudio(word, 'webster')).to.eventually.be.rejected;
  });

  it('test-drive', function () {
    var word = 'test-drive';
    return expect(getFirstAudio(word, 'collins')).to.be.rejectedWith(Error);
  });

  it('basilosaurus (from yahoo)', function () {
    var word = 'basilosaurus';
    return checkAudioAndFile('basilosaurus.mp3', word);
  });

  it('home schooling (from collins)', function () {
    var word = 'home schooling';
    return checkAudioAndFile('home_schooling.mp3', word, 'collins');
  });

  it('testing (from google)', function () {
    var word = 'testing';
    return checkAudioAndFile('testing.mp3', word, 'google');
  });

  it('Hello_World (from google)', function () {
    var word = 'Hello_World';
    return checkAudioAndFile('hello_world.mp3', word, 'google');
  });

  it('hello world (Audio is already exist, so it should return immediately)', function () {
    this.timeout(100);
    var word = 'hello world';
    return checkAudioAndFile('hello_world.mp3', word);
  });

  it('great (from ispeech)', function () {
    var word = 'great';
    return checkAudioAndFile('great.mp3', word, 'ispeech');
  });

  it('Have_A_Nice_Day (from ispeech)', function () {
    var word = 'Have_A_Nice_Day';
    return checkAudioAndFile('have_a_nice_day.mp3', word, 'ispeech');
  });

  it('perfect (from voicerss)', function () {
    var word = 'perfect';
    return checkAudioAndFile('perfect.mp3', word, 'voicerss');
  });

  it('today_is_sunday (from voicerss)', function () {
    var word = 'today_is_sunday';
    return checkAudioAndFile('today_is_sunday.mp3', word, 'voicerss');
  });

  it('askdjalksjdl', function () {
    var word = 'askdjalksjdl';
    return expect(getFirstAudio(word)).to.eventually.be.rejected;
  });

  it('(null)', function () {
    this.timeout(100);
    var word = null;
    return expect(getFirstAudio(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    this.timeout(100);
    var word = 123;
    return expect(getFirstAudio(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (string)', function () {
    var word = '123';
    return expect(getFirstAudio(word)).to.eventually.be.rejected;
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(getFirstAudio(word)).to.eventually.be.rejectedWith(TypeError);
  });
});
