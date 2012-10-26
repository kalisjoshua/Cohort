/*jshint laxcomma:true strict:false*/
/*globals console module process require*/
var child_process = require("child_process")
  , fs            = require("fs")

  // I'm not going to explain this
  , minify        = require("./minify.js")

  // A Signifer "handled financial matters and decorations"
  // filetype transformations
  , extensions    = {};

// Consul - elected official with military and/or civil duties, sometimes both
// determine what a task is attempting to do
function consul (task) {
  function test (rxp, obj) {
    return rxp.test({}.toString.call(obj));
  }
  if (test(/array/i, task)) {
    return primus;
  } else {
    return legatus;
  }
}

// Legatus legionis - the legate or overall legion commander, usually filled by a senator
// shell commands
function legatus (task, done, acc) {
  child_process.exec(task, function (err, stdout) {
    munifex(task);
    if (err) {
      munifex("An error occurred!", true);
      throw err;
    } else {
      munifex(stdout, true);
      done(acc);
    }
  });
}

// A Munifex is "basic legionary - the lowest of the trained rank and file"
// logger function
function munifex (str, error) {
  if (str) {
    console.log(error ? str : "Cohort says, '$'.".replace("$", str));
  }
}

// be ye careful, here be dragons - danger in the form of recursion
// A Praetor was an "appointed military commander of a legion or grouping of legions"
// recursion with CPS
function praetor (tasks, fn, done, acc) {
  /*
    tasks - an array of tasks to recurse over applying the function passed-in as "fn"
    fn - the operation to perform on each recursion
    done - the function to call when recursion is complete
    acc - accumulator for concatenating output of recursion
  */
  if (!tasks || !tasks.length) {
    done(acc);
  } else {
    fn(tasks[0], function (acc) {
      praetor(tasks.slice(1), fn, done, acc);
    }, acc);
  }
}

// Primus pilus - commanding centurion for the first cohort - the senior centurion of the entire legion
// file concat+minification
function primus (task, done, acc) {
  praetor(task[1], tribune, function (data) {
    // call either the css or js minifier function
    minify[tirones(task[0])](data, function (data) {
      munifex("Writing file " + task[0]);
      // prepend the acc because it will be continually cleaned up by minifiers
      // we only need one in the end anyway - this should be a user defined option in the future
      fs.writeFile(task[0], acc + data, "utf-8", done.bind(null, acc));
    });
  }, acc);
}

// The Tirones were "new recruit to the legions, a novice"
// file(path) extension
function tirones (str) {
  return (/\.(.+)$/).exec(str)[1];
}

// The Tribune were "young officers, second in command of the legion"
// file read handler
function tribune (file, done, acc) {
  fs.readFile(file, "utf-8", function (err, data) {
    if (err) {
      munifex("This file caused the error: " + file);
      throw err;
    } else {
      extensions[tirones(file)](file, data, function (data) {
        done(acc + "\n\n" + data);
      });
    }
  });
}

module.exports = function (config, init) {
  var banner = "/* file compiled by Cohort - by Joshua Kalis <joshuakalis.com> */\n";

  if (/init/i.test(process.argv[2])) {
    config.unshift(init); // prepend the init array to config
  }

  if ((/string/i).test({}.toString.call(config[0]))) {
    banner = config.shift();
  }

  praetor(config, function (tasks, done, acc) {
    praetor(tasks, consul(tasks[0]), done, acc);
  }, function () {
    munifex(" ", true);
    munifex("I'm all done.");
  }, banner);
};

module.exports.extend = function (ext, path) {
  extensions[ext] = require(path)(munifex);
};

module.exports.extend("coffee", "./signifer/coffee.js");
module.exports.extend("css", "./signifer/css.js");
module.exports.extend("js", "./signifer/js.js");
