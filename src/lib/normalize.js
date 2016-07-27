// normalize the word
module.exports = function (word) {
  if (typeof word !== 'string' || word.length === 0) {
    throw new TypeError('word should be a string');
  }

  // replace '_' to ' ', and convert to lower case
  return word.replace(/_/g, ' ').toLowerCase();
};

