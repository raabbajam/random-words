var split = require('split');
var through = require('through2');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var wordList = [];

function words(options) {

  function word() {
    return new Promise(function(resolve, reject) {
      var word;
      var wordLists = fs.createReadStream(path.resolve(options.file))
        .pipe(split())
        .pipe(randStream())
        .once('data', function (data) {
          wordLists.destroy();
          word = data;
        })
        .on('close', function () {
          return word ? resolve(word) : reject(new Error('Failed to get word!'));
        });
    });
  }

  function randInt(lessThan) {
    return Math.floor(Math.random() * lessThan);
  }


  function randStream(onpick) {
    var seen = 0;
    var target = randInt(options.length);
    var stream = through.obj(function (data, enc, cb) {
      if (target === seen++) return cb(null, data);
      cb();
    });

    if (onpick) stream.on('data', onpick);
    return stream;
  }

  // No arguments = generate one word
  // if (typeof(options) === 'undefined') {
  return word();
  // }

  /*// Just a number = return that many words
  if (typeof(options) === 'number') {
    options = { exactly: options };
  }

  // options supported: exactly, min, max, join

  if (options.exactly) {
    options.min = options.exactly;
    options.max = options.exactly;
  }
  var total = options.min + randInt(options.max + 1 - options.min);
  var results = [];
  for (var i = 0; (i < total); i++) {
    results.push(word());
  }
  if (options.join) {
    results = results.join(options.join);
  }
  return results;*/
}

module.exports = words;
// Export the word list as it is often useful
// words.wordList = wordList;
