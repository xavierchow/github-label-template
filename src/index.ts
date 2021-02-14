#!/usr/bin/env node

'use strict';

import * as  program from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import Debug from 'debug'
const debug = Debug('gh-label-tmpl:index');

import {Label } from './lib/label';

program
  .version('0.0.1')
  .option('-o, --owner [owner]', 'repo owner')
  .option('-r, --repo [repo]', 'repo name')
  .option('-t, --token [token]', 'github token')
  .option('-e, --export [filename]', 'export the lables to json file [filename]')
  .option('-d, --del', 'delete all existed labels')
  .option('-i, --import [filename]', 'import the labels from json file [filename]')
  //.option('-c, --config [config file]', 'use config file', 'config.json') //TODO or get git info?
  .parse(process.argv);

if (!program.opts().owner) {
  program.help((txt) => {
    console.error('should specify repo onwer!');
    return txt;
  });
}
if (!program.opts().repo) {
  program.help((txt) => {
    console.error('should specify repo name!');
    return txt;
  });
}
const options = program.opts();

const main = () => {
  const lbl = new Label(options.owner, options.repo, options.token);

  if (options.export) {
    const exportedFile = path.resolve(options.export);
    return lbl.getAll()
      .then(labels => {
        fs.writeFileSync(exportedFile, JSON.stringify(labels, null, 2));
        console.log(`All labels exported to ${exportedFile}`);
      });
  }
  if (program.opts().del) {
    return lbl.removeAll()
      .then(() => {
        console.log('All labels removed.');
      });
  }
  if (options.import) {
    debug('abs file path: %s', path.resolve(options.import));
    const labels = require(path.resolve(options.import));
    return lbl.createAll(labels)
      .then(() => {
        console.log('All labels created.');
      });
  }
  program.help((txt) => {
    console.error('No action specified!');
    return txt;
  });
};
main();


