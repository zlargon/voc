'use strict';
const fs       = require('fs');
const http     = require('http');
const https    = require('https');
const urlparse = require('url').parse;

module.exports = (url, dest) => new Promise((resolve, reject) => {
  const info = urlparse(url);
  const httpClient = info.protocol === 'https:' ? https : http;
  const options = {
    host: info.host,
    path: info.path,
    headers: {
      'user-agent': 'voc'
    }
  };

  httpClient.get(options, (res) => {
    // check status code
    if (res.statusCode !== 200) {
      const msg = `request to ${url} failed, status code = ${res.statusCode} (${res.statusMessage})`;
      reject(new Error(msg));
      return;
    }

    const file = fs.createWriteStream(dest);
    file.on('finish', () => {
      // close() is async, call resolve after close completes.
      file.close(resolve);
    });
    file.on('error', (err) => {
      // Delete the file async. (But we don't check the result)
      fs.unlink(dest);
      reject(err);
    });

    res.pipe(file);
  })
  .on('error', (err) => {
    reject(err);
  })
  .end();
});
