'use strict';

const ErrorTypes = require('./error-types');
const each = require('async/each');
const includes = require('lodash/includes');

/**
 * @summary Error class for delivering errors for the collins system
 * @param {String} type Error type name
 * @param {Object} data Data given to the error
 */
class CoreError extends Error {
  constructor (type, data) {
    super();
    this.name = this.constructor.name;
    this.data = data || {};
    this.type = type;
    each(
      type.split(':'),
      function checkType (errorType, cb) {
        if (!includes(ErrorTypes, errorType.toLowerCase())) {
          cb(true);
        } else {
          cb(null);
        }
      },
      (err) => {
        if (err) {
          throw new CoreError('TypeError', {
            details: 'invalid error type give to error object'
          });
        } else {
          this.type = type;
        }
      }
    );
    this.message = `<${this.type}> error message received`;
    let reasons = this.data.details || this.data.reasons;
    if (reasons) {
      this.message += ': ';
      if (Array.isArray(reasons)) {
        reasons.forEach((reason, index) => {
          this.message += `${index + 1}> ${reason}`;
        });
      } else {
        this.message += `${reasons}`;
      }
    } else {
      this.message += '.';
    }
  }

  static convert (type, error) {
    if (error) {
      if (!(error instanceof Error)) {
        throw new CoreError('Invalid:Input', 'invalid function call');
      }
    }
    let details = { details: error ? error.message : null };
    let convertedError = new CoreError(type, details);
    convertedError.stack = constructStack(error.stack, convertedError);
    return convertedError;
  }
}

/**
 * @summary construct static stack for error
 * @param  {String} fromStack `.stack` property from error being converted.
 * @param  {CoreError} constructObj CoreError object to receive stack.
 * @return {String}  Static stack to be assigned to CoreError object.
 */
function constructStack (fromStack, constructObj) {
  return constructObj.stack.split('\n')[0] + '\n' +
    fromStack
      .replace(/^[^\(]+?[\n$]/gm, '')
      .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@');
}

module.exports = CoreError;
