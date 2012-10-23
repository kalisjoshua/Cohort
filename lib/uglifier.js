/*jshint strict:false*/
/*globals module require*/
var ugly          = require("uglify-js")
  , parser        = ugly.parser
  , uglify        = ugly.uglify;

module.exports = function cohort_uglifier (input) {
  // https://github.com/mishoo/UglifyJS#api
  return uglify.gen_code(uglify.ast_squeeze(uglify.ast_mangle(parser.parse(input))));
};
