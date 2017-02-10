'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const utils = require('../../lib');


it('Should resolve with an expected string', (done) => {
  utils.Utilities.serializeJSON({ f: 1 })
    .should.be.fulfilled
    .then((serializedResponse) => {
      expect(serializedResponse).to.be.a('String');
      expect(serializedResponse).to.be.equal('{"f":1}');
      return Promise.resolve();
    })
    .then(done)
    .catch(done);
});

it('Should resolve with an expected string foc circular dependency', (done) => {
  const oTest = {
    f: 1,
  };
  oTest.testCircular = oTest;
  const expectedSerialize = '{"f":1,"testCircular":"[Circular]"}';
  utils.Utilities.serializeJSON(oTest)
    .should.be.fulfilled
    .then((serializedResponse) => {
      expect(serializedResponse).to.be.a('String');
      expect(serializedResponse).to.be.equal(expectedSerialize);
      return Promise.resolve();
    })
    .then(done)
    .catch(done);
});

it('Should reject with expected error', (done) => {
  utils.Utilities.unserializeJSON('')
    .should.be.rejected
    .then((errorUnserialized) => {
      expect(errorUnserialized).to.have.property('name', 'JSON_UNSERIALIZE_ERROR');
      expect(errorUnserialized.cause().message).to.be.equal('Unexpected end of JSON input');
      return Promise.resolve();
    })
    .then(done)
    .catch(done);
});

it('Should fulfill for a valid JSON representation', (done) => {
  const oTest = {
    f: 1,
  };
  oTest.testCircular = oTest;
  const expectedUnserialized = {
    f:            1,
    testCircular: '[Circular]',
  };
  utils.Utilities.serializeJSON(oTest)
    .then(serializedResponse => utils.Utilities.unserializeJSON(serializedResponse))
    .should.be.fulfilled
    .then((unserializedResponse) => {
      expect(unserializedResponse).to.be.eql(expectedUnserialized);
      return Promise.resolve();
    })
    .then(done)
    .catch(done);
});
