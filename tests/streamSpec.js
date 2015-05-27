var through = require('through2')
var assert = require('assert');
var fs = require('fs');
var random = require('pick-random-stream');
var path = require('path');
var split = require('split');
var JSONStream = require('JSONStream');
var request = require('request');

var getWords = require('../index');

function randInt(lessThan) {
  return Math.floor(Math.random() * lessThan);
}
function randStream(onpick) {
  var seen = 0;
  var target = randInt(86);
  target = 86;
  console.log('Target is %s.', target);
  var stream = through.obj(function (data, enc, cb) {
    if (target === seen++) return cb(null, data);
    cb();
  });

  if (onpick) stream.on('data', onpick);
  return stream;
}
describe('Pick random using stream', function () {
  this.timeout(30000);
  it.skip('should pick random using stream', function (done) {
    var stream1 = fs.createReadStream(path.resolve(__dirname, '../data/fruits.txt'))
      .pipe(split())
      .pipe(randStream())
      .once('data', function (fruit) {
        console.log('current fruit is %s.', fruit);
        stream1.destroy();
        // done();
      })
      .on('close', function () {
        done();
      });
  });
  it.skip('should pick random', function (done) {
    var stream2 = request('http://node-modules.com/modules.json')
      .pipe(JSONStream.parse('*'))
      .pipe(random())
      .once('data', function (module) {
        console.log('current random module is', module._id);
        stream2.destroy();
      })
      .on('close', function () {
        done();
      });
  });
  it('should pick random fruit using word', function (done) {
    getWords({
      file: path.resolve(__dirname, '../data/fruits.txt'),
      length: 86
    })
    .then(function (fruit) {
      console.log(fruit);
      done();
    });
  });
  it('should pick random keyword using word', function (done) {
    getWords({
      file: path.resolve(__dirname, '../data.txt'),
      length: 16443
    })
    .then(function (keyword) {
      console.log(keyword);
      done();
    });
  });
});
