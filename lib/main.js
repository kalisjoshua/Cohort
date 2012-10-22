/*jshint forin:false strict:false*/
/*globals __dirname console module process require*/
var child_process = require("child_process")
  , cleancss      = require("clean-css")
  , coffee        = require("coffee-script")
  , emitter       = new (require("events").EventEmitter)()
  , fs            = require("fs")
  , hinter        = require("./hinter.js")
  , uglifier      = require("./uglifier.js")

  , lib_functions
  , log = console.log;

function cleanup (files) {
  child_process.exec("rm -rf " + files.join(" "));
}

function init (arr) {
  log("initializing the project\nget ready to build");
  // TODO: rewrite this using the event emitter model!
  // arr.forEach(function (cmd) {child_process.exec(cmd, function (err, data) { if (err) {throw err;} });});
}

function joinFilesSync (destFile, tasks, fn) {
  fs.writeFileSync(destFile, fn(tasks[destFile].reduce(function (acc, path) {
    return acc + "\n\n" + fs.readFileSync(path);
  }, "")));
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

function tasks (head, tail) {
  if (head && head.task in lib_functions) {
    log(head.task);

    emitter.once("complete", function () {
      tasks(tail[0], tail.slice(1));
    });

    lib_functions[head.task](head.config);
  } else {
    emitter.emit("alldone");
  }
}

function task_complete () {
  emitter.emit("complete");
}

lib_functions = {
  coffee: function (tasks) {
    // recursive function to incrementally compile file
    child_process
      .exec(tasks[0], function (err) {
        if (err) {
          throw err;
        } else {
          tasks.slice(1).length ? lib_functions.coffee(tasks.slice(1)) : task_complete();
        }
      });
  }
  , css: function (tasks) {
    for (var destFile in tasks) {
      joinFilesSync(destFile, tasks, cleancss.process);
    }
    task_complete();
  }
  // , html: function () {}
  // , img: function () {}
  , js: function (tasks) {
    // loop over each collection of files in the config
    for (var destFile in tasks) {
      if (hinter(tasks[destFile])) {
        joinFilesSync(destFile, tasks, uglifier);
      } else {
        throw new Error(destFile + " did not pass jshint");
      }
    }
    task_complete();
  }
  , less: function (tasks) {
    // this is wrong!
    for (var destFile in tasks) {
      lessc(tasks[destFile], destFile, task_complete);
    }
  }
  // , sass: function () {}
  // , test: function () {}
};


module.exports = function (config) {
  if (/init/i.test(process.argv[2])) {
    init(config.init);
  }
  delete config.init;

  emitter.on("alldone", cleanup.bind(null, config.cleanup));
  delete config.cleanup;

  config = Object.keys(config)
    .map(function (item) {
      return {
          task: item
          ,config: config[item]
        };
    });

  tasks(config[0], config.slice(1));
};
