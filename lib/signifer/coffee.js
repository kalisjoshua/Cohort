/*jshint laxcomma:true strict:false*/
/*globals module require*/

var coffee = require("coffee-script");

module.exports = function (munifex) {
  return function signifer_coffee (path, input, done) {
    done(coffee.compile(input));
  };
};
