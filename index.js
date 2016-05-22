#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const path = require('path');
const Label = require('./lib/label');
const debug = require('debug')('gh-label-tmpl:index');

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

if (!program.owner) {
  program.help((txt) => {
    console.error('should specify repo onwer!');
    return txt;
  });
}
if (!program.repo) {
  program.help((txt) => {
    console.error('should specify repo name!');
    return txt;
  });
}
const main = () => {
  const lbl = new Label(program.owner, program.repo, program.token);

  if (program.export) {
    const exportedFile = path.resolve(program.export);
    return lbl.getAll()
      .then(labels => {
        fs.writeFileSync(exportedFile, JSON.stringify(labels, null, 2));
        console.log(`All labels exported to ${exportedFile}`);
      });
  }
  if (program.del) {
    return lbl.removeAll()
      .then(() => {
        console.log('All labels removed.');
      });
  }
  if (program.import) {
    debug('abs file path: %s', path.resolve(program.import));
    const labels = require(path.resolve(program.import));
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


