'use strict';
module.exports = {
  webster: {
    type: 'dic',
    getUrl: require('./dic/webster')
  },

  freedic: {
    type: 'dic',
    getUrl: require('./dic/freedictionary')
  },

  collins: {
    type: 'dic',
    getUrl: require('./dic/collins')
  },

  yahoo: {
    type: 'dic',
    getUrl: require('./dic/yahoo')
  },

  google: {
    type: 'tts',
    getUrl: require('./tts/google'),
    ext: '.mp3'
  },

  ispeech: {
    type: 'tts',
    getUrl: require('./tts/ispeech'),
    ext: '.mp3'
  },

  voicerss: {
    type: 'tts',
    getUrl: require('./tts/voicerss'),
    ext: '.mp3'
  }
};
