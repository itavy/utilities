'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const utils = require('../../lib');


const verror = require('verror');

it('Should return an instance of Werror', (done) => {
  const uErr = utils.Utilities.createError({
    name:    'errname',
    error:   new Error('test error'),
    info:    { id: 1 },
    message: 'err message',
  });
  expect(uErr).to.be.an.instanceof(verror.WError);
  done();
});

it('Should add timestamp if none provided', (done) => {
  const uErr = utils.Utilities.createError({
    name:    'errname',
    error:   new Error('test error'),
    info:    {},
    message: 'err message',
  });
  const uInfo = verror.VError.info(uErr);
  expect(uInfo).to.have.property('timestamp');
  done();
});

it('Should put only timestamp in info if info not provided', (done) => {
  const uErr = utils.Utilities.createError({
    name:    'errname',
    error:   new Error('test error'),
    message: 'err message',
  });
  const uInfo = verror.VError.info(uErr);
  expect(uInfo).to.be.eql({ timestamp: uInfo.timestamp });
  done();
});

it('Should add a default message if none provided', (done) => {
  const uErr = utils.Utilities.createError({
    name:  'errname',
    error: new Error('test error'),
    info:  {},
  });
  expect(uErr).to.have.property('message', 'An error has occurred');
  done();
});

it('Should put null as cause if none provided', (done) => {
  const uErr = utils.Utilities.createError({
    name: 'errname',
    info: {},
  });
  expect(uErr.cause()).to.be.equal(undefined);
  done();
});

it('Should use provided info', (done) => {
  const errName = 'eRrNaMe';
  const errTest = new Error('test error');
  const errMessage = 'eRrMeSsAgE';
  const uErr = utils.Utilities.createError({
    name:    errName,
    error:   errTest,
    info:    {},
    message: errMessage,
  });
  expect(uErr).to.have.property('message', errMessage);
  expect(uErr).to.have.property('name', errName);
  expect(uErr.cause()).to.be.equal(errTest);
  done();
});
