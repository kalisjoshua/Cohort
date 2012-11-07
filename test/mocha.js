/*jshint laxcomma:true strict:false*/
/*globals describe it module require*/

var assert = require("chai").assert
  , cohort = require("../lib/main.js")
  , fs     = require("fs")

  , fixt   = "./test/fixtures/";

cohort.extend("less");
cohort.logging(false);

function diffFiles(file1, file2, msg) {
  return assert.equal(fs.readFileSync(file1, "utf-8"), fs.readFileSync(file2, "utf-8"), msg);
}

function testFileThenRemove (file, done) {
  return function () {
    fs.stat(file, function (err, stat) {
      if (err || !stat.isFile()) {
        throw err || "Path '" + file + "' is not a file.";
      } else {
        diffFiles(file, file + "x", "File should match example.");
        cohort([["rm -f " + file]])(); // compiled files should be deleted
      }
      done();
    });
  };
}

describe("cohort", function () {
  it("should have a function as an entry point", function () {
    assert(cohort, "cohort should exists");
    assert.equal(typeof cohort, "function", "cohort should be a function");
  });

  it("should have an extend method for additional file types", function () {
    assert(cohort.extend, ".extend should be available");
    assert.equal(typeof cohort.extend, "function", ".extend should be a function");
  });

  it("should execute shell commands", function (done) {
    var file = fixt + "time.txt"
      , time = (new Date()).getTime();

    cohort([["echo " + time + " > " + file]])();

    fs.readFile(file, "utf-8", function (err, data) {
      assert.equal(data.replace(/\s/g, ""), time, time + "should match data from the file.");
      done();
    });
  });

  describe("CSS compilation", function () {
    var file = fixt + "ui";

    it("concatenates and minifies CSS files.", function (done) {
      var css = file + ".css";

      cohort([
        [[css
        , [file + ".menu.css"
          , file + ".widgets.css"]]]
        ], testFileThenRemove(css, done))();
    });
  });

  describe("JS compilation", function () {
    var file = fixt + "app";

    it("concatenate and uglify js files.", function (done) {
      var js = file + ".js";

      cohort([
        [[js
        , [file + ".lib.js"]]]
        ], testFileThenRemove(js, done))();
    });
  });

  describe("LESS compilation", function () {
    var file = fixt + "less";

    it("compiles a single LESS file.", function (done) {
      var css = file + ".css";

      cohort([
        [[css
        , [file + ".less"]]]
        ], testFileThenRemove(css, done))();
    });

    it("compiles and concatenates many LESS files into one CSS file.", function (done) {
      var css = file + "2.css";

      cohort([
        [[css
        , [file + ".less"
          , file + "2.less"
          , file + "3.less"]]]
        ], testFileThenRemove(css, done))();
    });
  });

});
