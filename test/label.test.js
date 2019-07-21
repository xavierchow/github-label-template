'use strict';
const expect = require('chai').expect;
const nock = require('nock');
const Label = require('../lib/label');

describe('Label class', () => {

  it('constructor', () => {
    const lbl = new Label('lorem', 'ipsum', 'dolor');
    expect(lbl.owner).be.equal('lorem');
    expect(lbl.repo).be.equal('ipsum');
    expect(lbl.token).be.equal('dolor');
  });

  it('getAll should succeed', () => {
    nock('https://api.github.com')
      .get('/repos/lorem/ipsum/labels')
      .reply(200, [
            {
              url: 'http://xxx.xxx',
              color: '523526',
              description: 'This is foo.',
              name: 'foo'
            },
            {
              url: 'http://xxx.xxx',
              color: 'f23266',
              description: null,
              name: 'bar'
            }
          ]);
    const lbl = new Label('lorem', 'ipsum', 'dolor');
    return lbl.getAll()
      .then((labels) => {
        expect(labels).to.deep.equal([
          {
            color: '523526',
            description: 'This is foo.',
            name: 'foo'
          },
          {
            color: 'f23266',
            name: 'bar'
          }
        ]);
      });
  });

  it('remove should succeed', () => {
    nock('https://api.github.com')
      .delete('/repos/lorem/ipsum/labels/sit')
      .reply(204);
    const lbl = new Label('lorem', 'ipsum', 'dolor');
    return lbl.remove('sit');
  });

  it('remove should fail if response code is not 204', () => {
    nock('https://api.github.com')
      .delete('/repos/lorem/ipsum/labels/sit')
      .reply(404);
    const lbl = new Label('lorem', 'ipsum', 'dolor');
    return lbl.remove('sit').catch(err => {
      expect(err.statusCode).to.be.equal(404);
    });
  });

  it('removeAll should succeed', () => {
    const lbl = new Label('lorem', 'ipsum', 'dolor');
    //mock getAll
    lbl.getAll = () => {
      return Promise.resolve([
          {
            color: '252562',
            description: 'This is ipsum',
            name: 'ipsum'
          },
          {
            color: '15f567',
            name: 'lorem'
          },
      ]);
    };
    lbl.remove = (labelName) => {
      expect(['ipsum', 'lorem']).to.include(labelName);
      return Promise.resolve();
    };
    return lbl.removeAll();
  });

  it('create should succeed', () => {
    nock('https://api.github.com')
      .post('/repos/lorem/ipsum/labels', {
        name: 'foobar',
        color: '235266'
      })
      .reply(201, {
        url: 'https://api.github.com/repos/lorem/ipsum/labels/foobar',
        name: 'foobar',
        color: '235266'
      });
    const lbl = new Label('lorem', 'ipsum', 'dolor');
    lbl.create({ name: 'foobar', color: '235266' });
  });

  it('create should succeed, with label description', () => {
    nock('https://api.github.com')
      .post('/repos/lorem/ipsum/labels', {
        color: '235266',
        description: 'foobar description',
        name: 'foobar'
      })
      .reply(201, {
        color: '235266',
        description: 'foobar description',
        url: 'https://api.github.com/repos/lorem/ipsum/labels/foobar',
        name: 'foobar'
      });
    const lbl = new Label('lorem', 'ipsum', 'dolor');
    lbl.create({ color: '235266', description: 'foobar description', name: 'foobar' });
  });

  it('createAll should succeed', () => {
    const json = require('./fixture/label.json');
    nock('https://api.github.com')
      .filteringRequestBody(/.*/, '*')
      .post('/repos/lorem/ipsum/labels', '*')
      .times(json.length)
      .reply(201, {
        url: 'https://api.github.com/repos/lorem/ipsum/labels/foobar',
        name: 'foobar',
        color: '235266'
      });
    const lbl = new Label('lorem', 'ipsum', 'dolor');
    return lbl.createAll(json);
  });
});
