var chai           = require('chai');
var chaiAsPromised = require('chai-as-promised');
var google         = require('../src/tts/google');
var expect         = chai.expect;

// setup promise
chai.use(chaiAsPromised);

describe('tts.google', function() {

  it('Hello', function () {
    var word = 'Hello';
    return expect(google(word)).to.eventually.match(/q=hello/);
    return expect(google(word)).to.eventually.match(/textlen=5/);
  });

  it('hello', function () {
    var word = 'hello';
    return expect(google(word)).to.eventually.match(/q=hello/);
    return expect(google(word)).to.eventually.match(/textlen=5/);
  });

  it('hello world', function () {
    var word = 'hello world';
    return expect(google(word)).to.eventually.match(/q=hello%20world/);
    return expect(google(word)).to.eventually.match(/textlen=11/);
  });

  it('Hello_World', function () {
    var word = 'Hello_World';
    return expect(google(word)).to.eventually.match(/q=hello%20world/);
    return expect(google(word)).to.eventually.match(/textlen=11/);
  });

  it('how_are_you', function () {
    var word = 'how_are_you';
    return expect(google(word)).to.eventually.match(/q=how%20are%20you/);
    return expect(google(word)).to.eventually.match(/textlen=11/);
  });

  it('123', function () {
    var word = '123';
    return expect(google(word)).to.eventually.match(/q=123/);
    return expect(google(word)).to.eventually.match(/textlen=3/);
  });

  it('(null)', function () {
    var word = null;
    return expect(google(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    var word = 123;
    return expect(google(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(google(word)).to.eventually.be.rejectedWith(TypeError);
  });

});
