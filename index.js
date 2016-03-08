#!/usr/bin/env node
require('babel-polyfill');
var voc = require('./bin/voc');

voc(process.argv)
.catch(function (e) {
  console.error(e.stack);
});
