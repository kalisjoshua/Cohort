/*jshint forin:false fancyternary:true strict:false*/
/*globals module require*/
var cleancss = require("clean-css")
  , exec = require("child_process").exec
  , fs = require("fs");
  // , Q = require("q");

function loggr (err, data) {
  /*globals console*/
  if (err) {throw err;}
  console.log(data);
}





function concatFileSync (acc, path) {
  return acc + fs.readFileSync(path);
}





var radishes = [];

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

doozer.add = [].push.bind(radishes);

doozer.cotterpin = {
  coffee: function () {}
, css: function (config) {
    for (var outputFile in config) {
      fs.writeFileSync(outputFile, cleancss.process(config[outputFile].reduce(concatFileSync, "")));
    }
  }
, hint: function () {}
, js: function () {}
, less: function () {}
, sass: function () {}
, turbo: function () {
    // for pre-build radishes
  }
};

doozer.doo = function (list) {
  radishes
    .forEach(function (radish) {
      Object.keys(radish)
        .forEach(function (type) {
          loggr(null, "doozer running " + type);
          if (list.length === 0 || list.indexOf(type) > -1) {
            doozer.cotterpin[type](radish[type]);
          }
          loggr(null, type + " finished.");
        });
    });
};

module.exports = doozer;
