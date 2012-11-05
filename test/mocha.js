/*jshint laxcomma:true strict:false*/
/*globals describe it module require*/

var assert = require("chai").assert
  , cohort = require("../lib/main.js")
  , fs     = require("fs")

  , fixt   = "./test/fixtures/";

cohort.extend("less");
cohort.logging(false);

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

  describe("LESS compilation", function () {
    var file = fixt + "less";

    before(function (done) {
      cohort([["rm -f " + file + ".css"]]
        , cohort([
          [[file + ".css"
          , [file + ".less"]]]
          ], done)
      )();
    });

    it("compiles a single LESS file.", function (done) {
      fs.readFile(file + ".css", "utf-8", function (err) {
        if (err) {
          throw err;
        } else {
          cohort([["rm -f " + file + ".css"]], done)();
        }
      });
    });

    before(function (done) {
      cohort([["rm -f " + file + "2.css"]]
        , cohort([
          [[file + "2.css"
          , [file + ".less"
            , file + "2.less"
            , file + "3.less"]]]
          ], done)
      )();
    });

    it("compiles and concatenates many LESS files into one CSS file.", function (done) {
      fs.readFile(file + "2.css", "utf-8", function (err, data) {
        if (err) {
          throw err;
        } else {
          cohort([["rm -f " + file + "2.css"]], done)();
        }
      });
    });
    
  });

});
