/* eslint-env node, jasmine */
const { expect } = require('chai');
const fs = require('fs');
const sinon = require('sinon');
const xmlToJson = require('../lib/actions/xmlToJson');

describe('XML 2 JSON parser', () => {
  let self;

  beforeEach(() => {
    self = {
      logger: {
        info: sinon.spy(),
        error: sinon.spy(),
        child: () => self.logger,
      },
      emit: sinon.spy(),
    };
  });

  it('should convert XML to JSON', async () => {
    const xml = fs.readFileSync('./spec/data/po.xml', 'utf-8');
    // eslint-disable-next-line global-require
    const result = require('./data/po.json');

    const message = {
      data: {
        xmlString: xml,
      },
      metadata: {},
    };
    await xmlToJson.process.bind(self)(message, {});
    expect(self.emit.getCalls().length).to.be.eql(2);
    const { data } = self.emit.getCalls()[0].args[1];
    expect(data).to.deep.equal(result);
  });

  it('should fail due to an invalid JSON', async () => {
    const xml = fs.readFileSync('./spec/data/invalidXml.xml', 'utf-8');

    const message = {
      data: {
        xmlString: xml,
      },
      metadata: {},
    };
    const messageText = 'Given XML is not valid or the file can not be read. '
      + 'See XML naming rules https://www.w3schools.com/xml/xml_elements.asp';

    await xmlToJson.process.bind(self)(message, {}).catch((error) => {
      expect(error.message).to.equal(messageText);
    });
  });
});
