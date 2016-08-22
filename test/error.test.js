'use strict';

const Assert = require('assert');
const CoreError = require('../libs/error');

describe('CoreError', () => {
  // INFO: setup
  let error = new CoreError('TestError', 'test');

  // INFO: declarations
  it('should export a constructor', () => {
    Assert.equal(typeof CoreError === 'function', true);
  });
  it('should create also an instance of CoreError', () => {
    Assert.equal(error instanceof CoreError, true);
  });
  it('should also be an instance of Error', () => {
    Assert.equal(error instanceof Error, true);
  });
  it('should have type `TestError`', () => {
    Assert.equal(error.type, 'TestError');
  });
  it('should throw when instanciated with an invalid ErrorType', () => {
    Assert.throws(() => {
      let badError = new CoreError('BadErrorType:MoreBadType');
      let noop = function (badErr) { return; };
      noop(badError);
    });
  });
  describe('convert', () => {
    let foreignError = new Error('testing');
    it('takes an Error', () => {
      Assert.equal(foreignError instanceof Error, true);
      Assert.equal(foreignError instanceof CoreError, false);
    });
    it('should convert Error into CoreError', () => {
      let convertedError = CoreError.convert('TestError', foreignError);
      Assert.equal(convertedError instanceof CoreError, true);
    });
  });
});
