/*jshint laxcomma:true strict:false*/
/*globals console module process require*/
var child_process = require("child_process")
  , fs            = require("fs")

  , minify        = require("./minify.js")

  , cohorts

  // A Signifer "handled financial matters and decorations"
  // filetype transformations
  , signifer      = {};

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

function readfile (file, done, acc) {
  fs.readFile(file, "utf-8", function (err, data) {
    if (err) {
      munifex("This file caused the error: " + file);
      throw err;
    } else {
      signifer[tirones(file)](file, data, function (data) {
        done(acc + "\n\n" + data);
      });
    }
  });
}

// The Tirones were "new recruit to the legions, a novice"
// file(path) extension
function tirones (str) {
  return (/\.(.+)$/).exec(str)[1];
}

cohorts = [
  function cohort_commands (task, done, acc) {
    child_process.exec(task, function (err, stdout) {
      if (err) {
        munifex("An error occurred while attempting to execute '" + task + "'", true);
        throw err;
      } else {
        munifex(task);
        munifex(stdout, true);
        done();
      }
    });
  }
  , function cohort_files (task, done, acc) {
    praetor(task[1], readfile, function (acc) {
      minify[tirones(task[0])](acc, function (data) {
        munifex("Writing file " + task[0]);
        fs.writeFile(task[0], data, "utf-8", done);
      });
    });
  }
];

module.exports = function (config, init) {
  if (/init/i.test(process.argv[2])) {
    cohorts.commands(init, function () {
      munifex("Project initialized.");
    });
  }

  praetor(config, function (tasks, done, acc) {
    praetor(tasks, cohorts[+(/array/i).test({}.toString.call(tasks[0]))], done, acc);
  }, function () {
    munifex(" ", true);
    munifex("I'm all done.");
  });
};

module.exports.extend = function (ext, path) {
  signifer[ext] = require(path)(munifex);
};

module.exports.extend("coffee", "./signifer/coffee.js");
module.exports.extend("css", "./signifer/css.js");
module.exports.extend("js", "./signifer/js.js");
