'use strict';

const { expect } = require('@itavy/test-utilities');
const utils = require('../../lib');

it('Should return an Uint8Array instance', (done) => {
  const strToUint8 = utils.Utilities.stringToUint8Array('testString');
  expect(strToUint8).to.be.an.instanceof(Uint8Array);
  done();
});

it('Should return a string', (done) => {
  const stringToTest = 'sTrInGtOtEsT0123456789';
  const strToUint8 = utils.Utilities.stringToUint8Array(stringToTest);
  const uint8ToStr = utils.Utilities.stringFromUint8Array(strToUint8);
  expect(uint8ToStr).to.be.equal(stringToTest);
  done();
});
