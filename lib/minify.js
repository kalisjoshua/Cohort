/*jshint laxcomma:true strict:false*/
/*globals module require*/
var cleancss      = require("clean-css")
  , ugly          = require("uglify-js")
  , parser        = ugly.parser
  , uglify        = ugly.uglify;

function uglifier (input) {
  // https://github.com/mishoo/UglifyJS#api
  return uglify.gen_code(uglify.ast_squeeze(uglify.ast_mangle(parser.parse(input))));
}

// The Optio is "second on command for the centurion"
// minifiers
module.exports = {
  css: function minify_css (input, done) {
    done(cleancss.process(input));
  }

  ,html: function minify_html (input, done) {
    done(input.replace(/[.\D]*<!DOCTYPE/im, "<!DOCTYPE"));
  }

  ,js: function minify_js (input, done) {
    done(uglifier(input));
  }

};
