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
  describe('CoreError#convert', () => {
    it('throws if second param is not an Error', () => {
      Assert.throws(
        () => {
          CoreError.convert('TestError', {});
        },
        'invalid function call'
      );
      Assert.throws(
        () => {
          CoreError.convert('TestError', 1);
        },
        'invalid function call'
      );
      Assert.throws(
        () => {
          CoreError.convert('TestError', 'string');
        },
        'invalid function call'
      );
      Assert.throws(
        () => {
          CoreError.convert('TestError', () => {});
        },
        'invalid function call'
      );
    });
    it('should convert Error into CoreError', () => {
      let foreignError = new Error('testing');
      let convertedError = CoreError.convert('TestError', foreignError);
      Assert.equal(convertedError instanceof CoreError, true);
    });
    it('should convert exceptions into CoreError', () => {
      try {
        throw new Error('test exception');
      } catch (exception) {
        let convertedError = CoreError.convert('TestError', exception);
        Assert.equal(convertedError instanceof CoreError, true);
      }
    });
    it('should contain *shallow* stack from passed exception', () => {
      try {
        throw new Error('test exception');
      } catch (exception) {
        let convertedError = CoreError.convert('TestError', exception);
        Assert.deepEqual(
          exception.stack.split('\n').slice(1, 5),
          convertedError.stack.split('\n').slice(1, 5)
        );
      }
    });
    it('should contain *shallow* stack from passed error', () => {
      let foreignError = new Error('testing');
      let convertedError = CoreError.convert('TestError', foreignError);
      Assert.deepEqual(
        foreignError.stack.split('\n').slice(1, 5),
        convertedError.stack.split('\n').slice(1, 5)
      );
    });
  });
});
