/*jshint laxcomma:true strict:false*/
/*globals module require*/

var cleancss = require("clean-css");

module.exports = function (munifex) {
  return function signifer_css (path, input, done) {
    done(cleancss.process(input));
  };
};
