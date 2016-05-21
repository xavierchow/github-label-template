'use strict';

const GH_HOST = 'https://api.github.com';

const debug = require('debug')('gh-label-tmpl:Label');
const request = require('request-promise');
const assert = require('assert');

class Label {
  constructor(owner, repo, token) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.rp = request.defaults({ 
      baseUrl: `${GH_HOST}/repos/${this.owner}/${this.repo}`,
      headers: {
        'user-agent': 'gh-label',
      },
      json: true
    });
 
  }

  getAll() {
    const options = {
      uri: `/labels`,
    };
    if (this.token) {
      options.headers = {
        Authorization: `token ${this.token}` //needed if private repo
      };
    }

    return this.rp(options)
      .then(res => {
        debug('original lables: %j', res);
        return res.map(label => {
          return { name: label.name, color: label.color };
        });
      });
  }

  remove(labelName) {
    const options = {
      uri: `/labels/${labelName}`,
      method: 'DELETE',
      headers: {
        Authorization: `token ${this.token}`
      },
      resolveWithFullResponse: true
    };
    return this.rp(options)
      .then(response => {
        if (response.statusCode !== 204) {
          throw new Error(`DELETE label failed with statusCode ${response.statusCode}`);
        }
        return;
      });
  } 

  removeAll() {
    const createRemovePromise = (labelName) => {
      return this.remove(labelName);
    };

    return this.getAll()
      .then(labels => {
        return labels.map(l => createRemovePromise(l.name)); 
      })
      .then(removePromises => {
        return Promise.all(removePromises);
      });
  }

  createAll(labels) {
    if (!Array.isArray(labels)) {
      return Promise.reject(new Error('Invalid import json'));
    }
    return Promise.all(labels.map(this.create, this));
  }

  create(label) {
    assert(label.name);
    assert(label.color);
    const options = {
      uri: `/labels`,
      method: 'POST',
      headers: {
        Authorization: `token ${this.token}`
      },
      body: label
    };
    return this.rp(options);
  }

}

module.exports = Label;
