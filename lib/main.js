/*jshint forin:false strict:false*/
/*globals __dirname console module process require*/
var child_process = require("child_process")
  , cleancss      = require("clean-css")
  , coffee        = require("coffee-script")
  , emitter       = new (require("events").EventEmitter)()
  , fs            = require("fs")
  , jshint        = require("jshint").JSHINT
  , ugly_parser   = require("uglify-js").parser
  , uglify        = require("uglify-js").uglify

  , doozer
  , log = console.log;

function cleanup (files) {
  child_process.exec("rm -rf " + files.join(" "));
}

function concatFilesSync (acc, path) {
  return acc + "\n\n" + fs.readFileSync(path);
}

function init (arr) {
  log("initializing the project\nget ready to build");
  // TODO: rewrite this using the event emitter model!
  // arr.forEach(function (cmd) {child_process.exec(cmd, function (err, data) { if (err) {throw err;} });});
}

function joinFilesSync (destFile, radishes, fn) {
  fs.writeFileSync(destFile, fn(radishes[destFile].reduce(concatFilesSync, "")));
}

function lessc (src, dist, done) {
  child_process.exec("lessc " + src + " > " + dist, function (err) {
    if (err) {
      throw err;
    } else {
      done();
    }
  });
}

function lint (files) {
  return files.reduce(function (acc, path) {
    return acc && jshint(fs.readFileSync(path).toString());
  }, true);
}

function tasks (head, tail) {
  if (head && head.task in doozer) {
    log(head.task);

    emitter.once("complete", function () {
      tasks(tail[0], tail.slice(1));
    });

    doozer[head.task](head.config);
  } else {
    emitter.emit("alldone");
  }
}

function task_complete () {
  emitter.emit("complete");
}

function uglifyjs (input) {
  // https://github.com/mishoo/UglifyJS#api
  return uglify.gen_code(uglify.ast_squeeze(uglify.ast_mangle(ugly_parser.parse(input))));
}

doozer = {
  coffee: function (radishes) {
    // recursive function to incrementally compile file
    child_process
      .exec(radishes[0], function (err) {
        if (err) {
          throw err;
        } else {
          radishes.slice(1).length ? doozer.coffee(radishes.slice(1)) : task_complete();
        }
      });
  }
  , css: function (radishes) {
    for (var destFile in radishes) {
      joinFilesSync(destFile, radishes, cleancss.process);
    }
    task_complete();
  }
  // , html: function () {}
  // , img: function () {}
  , js: function (radishes) {
    // loop over each collection of files in the config
    for (var destFile in radishes) {
      if (lint(radishes[destFile])) {
        joinFilesSync(destFile, radishes, uglifyjs);
      } else {
        throw new Error(destFile + " did not pass jshint");
      }
    }
    task_complete();
  }
  , less: function (radishes) {
    // this is wrong!
    for (var destFile in radishes) {
      lessc(radishes[destFile], destFile, task_complete);
    }
  }
  // , sass: function () {}
  // , test: function () {}
};


module.exports = function (radishes) {
  if (/init/i.test(process.argv[2])) {
    init(radishes.setup);
  }
  delete radishes.init;

  emitter.on("alldone", cleanup.bind(null, radishes.cleanup));
  delete radishes.cleanup;

  radishes = Object.keys(radishes)
    .map(function (item) {
      return {
          task: item
          ,config: radishes[item]
        };
    });

  tasks(radishes[0], radishes.slice(1));
};
