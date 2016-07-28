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
    return expect(getAudio(word, __dirname)).to.eventually.equal(
      path.resolve(__dirname, 'test.mp3')
    );
  });

  it('Hello', function () {
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
    var word = 'testing';
    return expect(getAudio(word, __dirname, 'webster')).to.eventually.be.rejected;
  });

  it('test-drive', function () {
    var word = 'test-drive';
    return expect(getAudio(word, __dirname, 'collins')).to.be.rejectedWith(Error);
  });

  it('testing (from google)', function () {
    var word = 'testing';
    return expect(getAudio(word, __dirname, 'google')).to.eventually.equal(
      path.resolve(__dirname, 'testing.mp3')
    );
  });

  it('Hello_World (from google)', function () {
    var word = 'Hello_World';
    return expect(getAudio(word, __dirname, 'google')).to.eventually.equal(
      path.resolve(__dirname, 'hello_world.mp3')
    );
  });

  it('hello world (Audio is already exist, so it should return immediately)', function () {
    this.timeout(100);
    var word = 'hello world';
    return expect(getAudio(word, __dirname)).to.eventually.equal(
      path.resolve(__dirname, 'hello_world.mp3')
    );
  });

  it('great (from ispeech)', function () {
    var word = 'great';
    return expect(getAudio(word, __dirname, 'ispeech')).to.eventually.equal(
      path.resolve(__dirname, 'great.mp3')
    );
  });

  it('Have_A_Nice_Day (from ispeech)', function () {
    var word = 'Have_A_Nice_Day';
    return expect(getAudio(word, __dirname, 'ispeech')).to.eventually.equal(
      path.resolve(__dirname, 'have_a_nice_day.mp3')
    );
  });

  it('perfect (from voicerss)', function () {
    var word = 'perfect';
    return expect(getAudio(word, __dirname, 'voicerss')).to.eventually.equal(
      path.resolve(__dirname, 'perfect.mp3')
    );
  });

  it('today_is_sunday (from voicerss)', function () {
    var word = 'today_is_sunday';
    return expect(getAudio(word, __dirname, 'voicerss')).to.eventually.equal(
      path.resolve(__dirname, 'today_is_sunday.mp3')
    );
  });

  it('askdjalksjdl', function () {
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
    var word = '123';
    return expect(getAudio(word, __dirname)).to.eventually.be.rejected;
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(getAudio(word, __dirname)).to.eventually.be.rejectedWith(TypeError);
  });
});
