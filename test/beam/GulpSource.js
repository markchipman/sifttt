'use strict';
const path = require('path');

require('chai').should();

const Pipeline = require('../../lib/beam/Pipeline');
const GulpSource = require('../../lib/beam/GulpSource');
const Read = require('../../lib/beam/Read');
const ct = require('../../lib/beam/coreTransforms');

describe('GulpSource', () => {
  it('simple file read', done => {
    let p = Pipeline.create({rethrowErrors: true})
    .apply(Read.from(new GulpSource(path.join(__dirname, '..', 'fixtures', 'file.json'))))
    .apply(new ct.FromVinyl())
    .apply(new ct.ParseJSON())
    .apply(new ct.DoTo(element => {
      element.should.have.property('hello', 'world');
    }))
    ;

    p.run(done);
  });
});
