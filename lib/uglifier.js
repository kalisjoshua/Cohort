/*jshint strict:false*/
/*globals module require*/
var ugly_parser   = require("uglify-js").parser
  , uglify        = require("uglify-js").uglify;

module.exports = function cohort_uglifier (input) {
  // https://github.com/mishoo/UglifyJS#api
  return uglify.gen_code(uglify.ast_squeeze(uglify.ast_mangle(ugly_parser.parse(input))));
};
