'use strict';

/**
 * Utilities module
 * @module @itavy
 */

/**
 * verror
 * @external verror
 * @see {@link https://github.com/joyent/node-verror}
 */
/**
 * text-encoding
 * @external text-encoding
 * @see {@link https://github.com/inexorabletash/text-encoding}
 */

/**
 * @typedef {Object} dependencyRule
 * @property {String} name name of the property to look for
 * @property {Boolean} [required = false] signal if the property is mandatory
 * @property {*} defaultValue if the property is mandatory and not present,
 * the result will take this value
 */

/**
 * verror library
 * @type {external:verror}
 * @private
 */
const verror = require('verror');

/**
 * Error list
 * @type {Object}
 * @private
 */
const errors = require('./Errors');

/**
 * Text Encoding library
 * @type {external:text-encoding}
 */
const StringDecoderLib = require('text-encoding');

/**
 * Uint8Array to string
 * @type {external:text-encoding.TextDecoder}
 */
const sDecoder = new StringDecoderLib.TextDecoder('utf-8');
/**
 * String to Uint8Array
 * @type {external:text-encoding.TextEncoder}
 */
const sEncoder = new StringDecoderLib.TextEncoder('utf-8');

/**
 * Utilities class
 */
class Utilities {
  /**
   * Check if an object has property
   * @param {Object} objToBeCheck Object to be checked
   * @param {String} propertyName Name of the property to look for
   * @return {Boolean} Returns true if the object has the requested property
   */
  static has(objToBeCheck, propertyName) {
    return Object.prototype.hasOwnProperty.call(objToBeCheck, propertyName);
  }

  /**
   * Return a new object by combining the one provided
   * @param {Object} objToExtend first object
   * @param {Object} objToAdd second object
   * @return {Object} new object
   */
  static extend(objToExtend, ...objToAdd) {
    return Object.assign({}, ...objToAdd, objToExtend);
  }

  /**
   * Provide an abstract way to construct errors
   * @param  {Object} errorInfo infos required to build an error
   * @param  {String} errorInfo.name name of the error to be displayed
   * @param  {Object} [errorInfo.error] original error
   * @param  {Object} [errorInfo.info] extra info regarding the error
   * @param  {String} [errorInfo.message] Human readable message for error
   * @return {external:verror.WError} an instance of WError
   */
  static createError(errorInfo) {
    return new verror.WError({
      name:  errorInfo.name,
      cause: errorInfo.error || null,
      info:  Utilities.extend(errorInfo.info || {}, { timestamp: Date.now() }),
    }, errorInfo.message || 'An error has occurred');
  }

  /**
   * Validate that provided dependency meet required criteria
   * @param  {Object} dependency infos required for validation
   * @param  {String} dependency.name name of the module for which you validate
   * @param  {Object} dependency.di subject to validate
   * @param  {dependencyRule[]} dependency.rules rules to validate
   * @return {Object} computed dependency
   */
  static validateConstructorDependencies(dependency) {
    const returnDependency = {};
    dependency.rules.every((rule) => {
      if (Utilities.has(dependency.di, rule.name)) {
        returnDependency[rule.name] = dependency.di[rule.name];
      } else {
        if (rule.required) {
          throw Utilities.createError({
            name:    errors.REQUIRED_DEPENDENCY.name,
            message: `Missing ${rule.name} for module ${dependency.name}`,
          });
        }
        if (Utilities.has(rule, 'defaultValue')) {
          if (rule.defaultValue instanceof Function) {
            returnDependency[rule.name] = rule.defaultValue();
          } else {
            returnDependency[rule.name] = rule.defaultValue;
          }
        } else {
          throw Utilities.createError({
            name:    errors.REQUIRED_DEPENDENCY.name,
            message: `Missing ${rule.name} for module ${dependency.name} and no defautlValue provided`,
          });
        }
      }
      return true;
    });
    return Utilities.extend(dependency.di, returnDependency);
  }

  /**
   * Utility for transforming strings into Uint8Array
   * @param {String} request String to be transformed into Uint8Array
   * @returns {Uint8Array} Uint8Array
   */
  static stringToUint8Array(request) {
    return sEncoder.encode(request);
  }

  /**
   * Utility for transforming Uint8Array into strings
   * @param {Uint8Array} request Uint8Array to be transformed into String
   * @returns {String} String
   */
  static stringFromUint8Array(request) {
    return sDecoder.decode(request);
  }
}

/**
 * @itavy/Common singleton
 * @type {Utilities}
 */
let sUtilities = null;

/**
 * Utilities singleton builder
 * At this point Utilities class can be used as singleton without this wrapper,
 * later on if i will need to have context inside this class i will need
 * to have this wrapper and i added this extra wraper at this moment
 * @return {Utilities} Utilities instance
 */
const getUtilities = () => {
  if (null === sUtilities) {
    sUtilities = Utilities;
  }
  return sUtilities;
};

module.exports = {
  getUtilities,
  Utilities,
};
