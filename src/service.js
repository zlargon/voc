module.exports = {
  webster: {
    type: 'dic',
    getUrl: require('./dic/webster')
  },

  collinsEducation: {
    type: 'dic',
    getUrl: require('./dic/collins-education')
  },

  yahoo: {
    type: 'dic',
    getUrl: require('./dic/yahoo')
  },

  collins: {
    type: 'dic',
    getUrl: require('./dic/collins')
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
