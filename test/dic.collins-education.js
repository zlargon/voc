var rewire  = require('rewire');
var chai    = require('chai');
var expect  = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

var collins = rewire('../src/dic/collins-education');
describe('dic.collins.education', function() {

  before(function () {
    // mock console.log
    collins.__set__({
      console: {
        log: function () {}
      }
    });
  });

  it('Hello', function () {
    this.timeout(10000);
    var word = 'Hello';
    return expect(collins(word)).to.eventually.equal(
      'http://www.collinsdictionary.com/sounds/e/en_/en_us/en_us_hello_2.mp3'
    );
  });

  it('test', function () {
    this.timeout(10000);
    var word = 'test';
    return expect(collins(word)).to.eventually.equal(
      'http://www.collinsdictionary.com/sounds/e/en_/en_us/en_us_test_1.mp3'
    );
  });

  it('Test Case', function () {
    this.timeout(10000);
    var word = 'Test Case';
    return expect(collins(word)).to.eventually.equal(
      'http://www.collinsdictionary.com/sounds/e/en_/en_us/en_us_test_case.mp3'
    );
  });

  it('Test-Drive', function () {
    this.timeout(10000);
    var word = 'Test-Drive';
    return expect(collins(word)).to.eventually.be.rejectedWith(Error);
  });

  it('askdjalksjdl', function () {
    this.timeout(10000);
    var word = 'askdjalksjdl';
    return expect(collins(word)).to.eventually.be.rejected;
  });

  it('(null)', function () {
    this.timeout(10000);
    var word = null;
    return expect(collins(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (number)', function () {
    this.timeout(10000);
    var word = 123;
    return expect(collins(word)).to.eventually.be.rejectedWith(TypeError);
  });

  it('123 (string)', function () {
    this.timeout(10000);
    var word = '123';
    return expect(collins(word)).to.eventually.be.rejected;
  });

  it('(Empty String)', function () {
    var word = '';
    return expect(collins(word)).to.eventually.be.rejectedWith(TypeError);
  });
});
