require('babel-polyfill');

var fs       = require('fs');
var util     = require('util');
var urlParse = require('url').parse;
var http     = require('http');
var https    = require('https');
var path     = require('path');
var Service  = require('./service');

function getExistAudio (word, directory) {
  var ext = ['.mp3', '.wav'];
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

var downloadAudio = async function (word, directory, serviceName) {
  var serv = Service[serviceName];
  if (!serv) throw new Error(util.format("Unknown Service '%s'", serviceName));

  var url = await serv.getUrl(word);
  var ext = serv.ext || path.extname(url);
  var audioName = word + ext;                         // audio.mp3 or audio.wav
  var audioDest = path.resolve(directory, audioName); // audio destination

  await downloadFile(url, audioDest);
  console.log("Download '%s' from %s ...", audioName, serviceName);
  return audioDest;
};

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
        var msg = util.format('request to %s failed, status code = %d (%s)', url, res.statusCode, res.statusMessage);
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

module.exports = async function (word, directory, service) {
  if (typeof word !== 'string' || word.length === 0) {
    throw new TypeError('word should be a string');
  }

  // convert to lower case
  word = word.toLowerCase();

  // force to download audio from particular service
  if (service) {
    return await downloadAudio(word, directory, service);
  }

  // check audio is exist or not
  var audio = getExistAudio(word, directory);
  if (audio !== null) {
    return audio;
  }

  // audio is not exist, search audio URL of the word
  for (var serv in Service) {

    // download by 'Dictionary' only,
    // because it can always download audio from 'TTS' successfully even the words are misspell
    if (Service[serv].type !== 'dic') {
      continue;
    }

    try {
      return await downloadAudio(word, directory, serv);
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
};
