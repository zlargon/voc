#!/usr/bin/env node
'use strict';
require('babel-polyfill');
const voc = require('./voc');

voc(process.argv)
.catch(e => {
  console.error(e.stack);
});
