/*jshint strict:false*/
/*globals module require*/
var fs     = require("fs")
  , jshint = require("jshint").JSHINT;

module.exports = function cohort_hinter (files) {
  return files.reduce(function (acc, path) {
    return acc && jshint(fs.readFileSync(path).toString());
  }, true);
};
