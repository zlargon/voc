var fs        = require('fs');
var urlParse  = require('url').parse;
var http      = require('http');
var https     = require('https');
var path      = require('path');
var Promise   = require('promise');
var coroutine = require('co');

var services = [
  require('./webster'),
  require('./voicetube'),
  require('./yahoo')
];

function isFileExist (filePath) {
  return new Promise(function (resolve, reject) {
    try {
      fs.statSync(filePath);
      resolve(true);
    } catch (e) {
      if (e.code === 'ENOENT') {
        resolve(false);
      } else {
        throw e;
      }
    }
  });
}

function downloadFile (url, dest) {
  return new Promise(function (resolve, reject) {
    var info = urlParse(url);
    var httpClient = info.protocol === 'https:' ? https : http;
    var options = {
      host: info.host,
      path: info.path,
      headers: {
        'user-agent': 'voc'
      }
    };

    httpClient.get(options, function(res) {
      // check status code
      if (res.statusCode !== 200) {
        var msg = url + ', status code ' + res.statusCode + '(' + res.statusMessage + ')';
        reject(new Error(msg));
        return;
      }

      var file = fs.createWriteStream(dest);
      file.on('finish', function() {
        // close() is async, call resolve after close completes.
        file.close(resolve);
      });
      file.on('error', function (err) {
        // Delete the file async. (But we don't check the result)
        fs.unlink(dest);
        reject(err);
      });

      res.pipe(file);
    })
    .on('error', function(err) {
      reject(err);
    })
    .end();
  });
}

module.exports = function getAudio (word, directory) {
  return coroutine(function * () {
    word = word.toLowerCase();  // throw error if word is not string

    // 1. check audio is exist or not
    var audios = [
      path.resolve(directory, word + '.wav'),
      path.resolve(directory, word + '.mp3')
    ];
    for (var i = 0; i < audios.length; i++) {
      if (yield isFileExist(audios[i])) {
        return audios[i];
      }
    }

    // 2. audio is not exist, search word's audio URL
    var url = null, serv = null;
    for (var i = 0; i < services.length; i++) {
      serv = services[i];
      try {
        url = yield serv(word);
        break;
      } catch (e) {
        // get url failed
      }
    }

    // word is not found from all the services
    if (url === null) {
      var err = new Error(word + ' is not found');
      err.code = 'ENOENT';
      throw err;
    }

    // 3. download word's audio
    var audioName = word + path.extname(url);           // audio.mp3 or audio.wav
    var audioDest = path.resolve(directory, audioName); // audio destination

    yield downloadFile(url, audioDest);
    console.log("Download '%s' from %s ...", audioName, serv.name);

    return audioDest;
  });
}
