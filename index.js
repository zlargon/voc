#!/bin/sh
":" //# comment; exec /usr/bin/env node --harmony "$0" "$@"

var voc = require('./src/voc');

voc(process.argv)
.catch(function (e) {
  console.error(e.stack);
});
