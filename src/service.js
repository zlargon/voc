module.exports = {
  webster: {
    type: 'dic',
    getUrl: require('./dic/webster')
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
