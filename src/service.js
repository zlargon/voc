module.exports = {
  webster: {
    type: 'dic',
    getUrl: require('./webster')
  },

  collins: {
    type: 'dic',
    getUrl: require('./collins')
  },

  yahoo: {
    type: 'dic',
    getUrl: require('./yahoo')
  },

  google: {
    type: 'tts',
    getUrl: require('./google'),
    ext: '.mp3'
  },

  ispeech: {
    type: 'tts',
    getUrl: require('./ispeech'),
    ext: '.mp3'
  },

  voicerss: {
    type: 'tts',
    getUrl: require('./voicerss'),
    ext: '.mp3'
  }
};
