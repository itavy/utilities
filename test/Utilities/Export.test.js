'use strict';

const { expect } = require('@itavy/test-utilities');
const utils = require('../../lib');


it('Should export required info', (done) => {
  expect(Object.keys(utils).length).to.equal(2);
  expect(utils).to.have.property('getUtilities');
  expect(utils).to.have.property('Utilities');

  done();
});

it('Utilities should have expected definition', (done) => {
  [
    'has',
    'extend',
    'createError',
    'validateConstructorDependencies',
    'stringToUint8Array',
    'stringFromUint8Array',
    'serializeJSON',
    'unserializeJSON',
  ].map(el => expect(utils.Utilities).to.have.property(el));
  done();
});

it('Should export same instance', (done) => {
  const utils1 = utils.getUtilities();
  const utils2 = utils.getUtilities();
  expect(utils1).to.be.equal(utils2);
  done();
});
