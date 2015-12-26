var fs        = require('fs');
var urlParse  = require('url').parse;
var http      = require('http');
var https     = require('https');
var path      = require('path');
var Promise   = require('promise');
var coroutine = require('co');
var google    = require('./google');

var Service = {
  webster:   require('./webster'),
  voicetube: require('./voicetube'),
  yahoo:     require('./yahoo')
};

function getExistAudio (word, directory) {
  var ext = ['.wav', '.mp3'];
  for (var i = 0; i < ext.length; i++) {
    var audio = path.resolve(directory, word + ext[i]);

    try {
      fs.statSync(audio);
      return audio;
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e;
      }
    }
  }
  return null;
}

function downloadAudio (word, directory, serviceName) {
  return coroutine(function * () {
    var serv = serviceName === 'google' ? google : Service[serviceName];
    if (!serv) throw new Error("Unknown Service '" + serviceName + "'");

    var url = yield serv(word);
    var ext = serviceName === 'google' ? '.mp3' : path.extname(url);
    var audioName = word + ext;                         // audio.mp3 or audio.wav
    var audioDest = path.resolve(directory, audioName); // audio destination

    yield downloadFile(url, audioDest);
    console.log("Download '%s' from %s ...", audioName, serviceName);
    return audioDest;
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

module.exports = function getAudio (word, directory, service) {
  return coroutine(function * () {
    if (typeof word !== 'string' || word.length === 0) {
      throw TypeError('word should be a string');
    }

    // convert to lower case
    word = word.toLowerCase();

    // force to download audio from particular service
    if (service) {
      return yield downloadAudio(word, directory, service);
    }

    // check audio is exist or not
    var audio = getExistAudio(word, directory);
    if (audio !== null) {
      return audio;
    }

    // audio is not exist, search audio URL of the word
    for (var serv in Service) {
      try {
        return yield downloadAudio(word, directory, serv);
      } catch (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }
      }
    }

    // audio is not found
    var err = new Error(word + ' is not found');
    err.code = 'ENOENT';
    throw err;
  });
}
