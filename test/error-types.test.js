'use strict';

const Assert = require('assert');
const ErrorTypes = require('../libs/error-types');

describe('ErrorTypes', () => {
  it('should export an array', () => {
    Assert.equal(Array.isArray(ErrorTypes), true);
  });
  it('should export all elements as lowercase', () => {
    let regex = /(?=[A-Z])/;
    ErrorTypes.forEach((type) => {
      Assert.equal(type.split(regex).length, 1);
    });
  });
});
