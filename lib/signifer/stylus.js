/*jshint strict:false*/
/*globals module require*/

var stylus = require('stylus');

module.exports = function (munifex) {
  return function signifer_stylus (path, input, done) {
    try {
      stylus.render(input, {filename: path}, function (err, css) {
        if (err) {
          munifex("Parse error " + path);
          throw err;
        } else {
          done(css);
        }
      });
    } catch (err) {
      munifex("Read error " + path);
      throw err;
    }
  };
};
