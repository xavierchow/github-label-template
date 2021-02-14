#!/usr/bin/env node
'use strict';
exports.__esModule = true;
var program = require("commander");
var fs = require("fs");
var path = require("path");
var debug_1 = require("debug");
var debug = debug_1["default"]('gh-label-tmpl:index');
var label_1 = require("./lib/label");
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
    program.help(function (txt) {
        console.error('should specify repo onwer!');
        return txt;
    });
}
if (!program.opts().repo) {
    program.help(function (txt) {
        console.error('should specify repo name!');
        return txt;
    });
}
var options = program.opts();
var main = function () {
    var lbl = new label_1.Label(options.owner, options.repo, options.token);
    if (options["export"]) {
        var exportedFile_1 = path.resolve(options["export"]);
        return lbl.getAll()
            .then(function (labels) {
            fs.writeFileSync(exportedFile_1, JSON.stringify(labels, null, 2));
            console.log("All labels exported to " + exportedFile_1);
        });
    }
    if (program.opts().del) {
        return lbl.removeAll()
            .then(function () {
            console.log('All labels removed.');
        });
    }
    if (options["import"]) {
        debug('abs file path: %s', path.resolve(options["import"]));
        var labels = require(path.resolve(options["import"]));
        return lbl.createAll(labels)
            .then(function () {
            console.log('All labels created.');
        });
    }
    program.help(function (txt) {
        console.error('No action specified!');
        return txt;
    });
};
main();
