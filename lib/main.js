/*jshint laxcomma:true strict:false*/
/*globals module process require*/

var child_process = require("child_process")
  , fs            = require("fs")

  // I'm not going to explain this
  , minify        = require("./minify.js")

  // or these
  , logging       = true
  , noop          = function () {}

  // A Signifer "handled financial matters and decorations"
  // filetype transformations
  , extenders     = {
      coffee: "./signifer/coffee.js"
    , less: "./signifer/less.js"
    , scss: "./signifer/scss.js"
    , styl: "./signifer/stylus.js"
  }
  , extensions    = {};

// NOTE: throughout this library the identifier 'acc' is
// used as an accumulator for concatenating data together

// Consul - elected official with military and/or civil duties, sometimes both
// determine what a task is attempting to do
function consul (task) {
  var rType = /^\[object\s(.*)\]$/;
  return ({
      "Array" : primus
    , "String": legatus
  }[rType.exec({}.toString.call(task))[1]] || task);
}

// Cohort - 6 centuries or a total of 480 fighting men
// execution function for build
function cohort (tasks, cb) {
  // return a function so that building async tasks is possible
  return function () {
    praetor(tasks, function (tasks, done, acc) {
      praetor(tasks, consul(tasks[0]), done, acc);
    }, function () {
      cb();
      munifex(" ", true);
      munifex("I'm all done.");
    });
  };
}

// Legatus legionis - the legate or overall legion commander, usually filled by a senator
// shell commands
function legatus (task, done) {
  child_process.exec(task, function (err, stdout) {
    munifex(task);
    if (err) {
      munifex("An error occurred!", true);
      throw err;
    } else {
      munifex(stdout, true);
      done();
    }
  });
}

// A Munifex is "basic legionary - the lowest of the trained rank and file"
// logger function
function munifex (str, error) {
  /*globals console*/
  if (logging && str) {
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
  // check for banner in config and prepend if present
  acc = (task.length === 3 ? task.shift() : "") + (acc || "");
  praetor(task[1], tribune, function (data) {
    // call minifier function
    minify[tirones(task[0])](data, function (data) {
      munifex("Writing file " + task[0]);
      fs.writeFile(task[0], acc + data, "utf-8", done);
    });
  }, acc);
}

// The Tirones were "new recruit to the legions, a novice"
// determine file(path) extension
function tirones (str) {
  return (/([\d\w]+)$/).exec(str)[1];
}

// The Tribune were "young officers, second in command of the legion"
// file read handler
function tribune (file, done, acc) {
  munifex("attempting to read file: " + file);

  fs.readFile(file, "utf-8", function (err, data) {
    if (err) {
      munifex("This file caused the error: " + file);
      throw err;
    } else {
      // here, use the proper filetype processor - based on file extension -
      // to process the contents of the file to prepare for writing to disk
      // NOTE: while there is a 'coffeescript' handler for this, it is not the suggested workflow
      extensions[tirones(file)](file, data, function (data) {
        done(acc + data);
      });
    }
  });
}

module.exports = function (config, init, cb) {
  // fix arguments if cohort is not passed an init argument and is passed a callback
  if (arguments.length === 2 && (/function/i).test({}.toString.call(init))) {
    cb = init;
    init = [];
  }

  // if cohort is run with 'init' as a cli argument also include the init tasks
  if ((/array/i).test({}.toString.call(init)) && (/init/i).test(process.argv[2])) {
    config.unshift(init); // prepends the init array to config
  }

  return cohort(config, cb || noop);
};

// to add file extension handlers
module.exports.extend = function (ext, path) {
  if (extenders[ext] && !path) {
    path = extenders[ext];
  }
  extensions[ext] = require(path)(munifex);
};

// mostly for disabling logging during testing
module.exports.logging = function (option) {
  logging = !!option;
};

module.exports.extend("css", "./signifer/css.js");
module.exports.extend("html", "./signifer/html.js");
module.exports.extend("js", "./signifer/js.js");
