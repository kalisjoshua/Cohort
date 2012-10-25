/*jshint strict:false*/
/*globals module require*/

var sass = require('node-sass');

module.exports = function (munifex) {
  return function signifer_scss (path, input, done) {
    try {
      sass.render(input, function (err, data) {
        if (err) {
          munifex("Parse error " + path);
          throw err;
        } else {
          done(data);
        }
      });
    } catch (err) {
      munifex("Read error " + path);
      throw err;
    }
  };
};
