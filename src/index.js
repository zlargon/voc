#!/usr/bin/env node
require('babel-polyfill');
var voc = require('./voc');

voc(process.argv)
.catch(e => {
  console.error(e.stack);
});
