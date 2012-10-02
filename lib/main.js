/*jshint forin:false fancyternary:true strict:false*/
/*globals module require*/
var cleancss = require("clean-css")
  , exec = require("child_process").exec
  , fs = require("fs")
  , Q = require("q");

function loggr (err, data) {
  /*globals console*/
  if (err) {throw err;}
  console.log(data);
}

function openFile (acc, path) {
  return acc + fs.readFileSync(path);
}


function doozer (config) {
  for (var prop in config) {
    loggr(null, "doozer running " + prop);
    if (prop in doozer) {
      doozer[prop](config[prop]);
    } else {
      // throw new Error(prop + " is not defined in doozer.");
    }
    loggr(null, prop + " finished.");
  }
}

doozer.css = function (options) {
  var output, result = {};
  for (output in options) {
    fs.writeFileSync(output, cleancss.process(options[output].reduce(openFile, "")));
  }
};

// doozer.init = function () {
//   exec("git submodule update --init --recursive", loggr);
//   exec("npm install", loggr);
// };

module.exports = doozer;
