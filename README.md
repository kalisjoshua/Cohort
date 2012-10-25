# Cohort

Compiling files is tedious. Humans are bad at doing tedious things because we get bored and make mistakes. Computers are good at doing tedious things because they don't get bored and do everything they are told to do. Building source files into a distributable set of files is something that is tedious and needs to be done consistently between developers of a project so why not let the computer do that work for you?

Cohort is an attempt to alleviate most of the this work for the developer. Simply define the procedures to perform to achieve a complete build of a project. The focus of Cohort is the simplicity of the setup; no programming should be necessary by the developer, beyond what they would have to do without a tool such as Cohort. The goal is for Cohort to be a drop-in helper to most projects; if you are using a Cakefile for compiling your Coffeescript you wont need to duplicate any of that in Cohort because the Cakefile will just be executed by Cohort instead of you.

Cohort is meant to be a companion to you and your chosen development environment with a single purpose; to create a "build" of your source files. Therefore if it is unable to complete a task it should fail outright and not try and continue; this also means that Cohort should not make itself a route to attempt a "partial build" of a project.

## Features

* Perform initial project setup
** (optionally) git submodules download and build
** (optionally) npm dependencies
* Execute commands before the build starts
* Lint files
* Concatenate and Minify files
* Run tests on compiled files
* Cleanup any temp files produced by the build

## Examples

Here is a basic example of Cohort doing lint*/concat/min on some css and js. 

 *Linting is only done on js files currently.

    var cohort = require("cohort");

    cohort([
        [ // files
          ["dist/css/app.css", [
              "src/less/libs.less"
            , "src/sass/example.scss"
            , "src/css/sample.css"
            , "src/css/another.css"
            ]]

          , ["dist/css/sass_libs.css", [
              "src/sass/example.scss"
            ]]

          , ["dist/css/stylus_libs.css", [
              "src/stylus/lib.styl"
            ]]

          , ["dist/js/app.js", [
              "src/js/app.js"
            , "dist/js/coffee_libs.js" // from Cake built file
            , "src/js/lib/important.coffee" // inline compile of coffee file
            ]]
        ]
      ]);

The output of running this Cohort file will be the two files within the `dist` directory (`css/app.css` and `js/app.js`).

Notice that Cohort doesn't care about the type of files that will be concat'ed together (e.g. the css file accepts: css, less, scss[, more coming]). *Cohort does not support sass syntax as `libsass` doesn't support it, since it is deprecated.* Cohort will also concat coffee files inline although this is an anti-pattern since coffee files should be compiled together for optimizations that the coffescript compiler will do; Cohort suggests using a `Cakefile` to compile before concating js files together.

To execute commands before and/or after the files have been compiled Cohort offers a few options.

    cohort([
      [ // pre-build
          "cake -d dist/js -f coffee_libs bake"
        ]

      , [/*...*/] // files

      , [ // testing
          "mocha"
        ]

      , [ // cleanup
          "rm -rf dist/js/coffee_libs.js"
        ]
      ]
      , [ // init
          "git submodule update --init --recursive"
        , "npm install"
        ]);

Strings within the arrays are just commands that will be executed in the shell so will have access to installed libraries.

## Use

The expected use case for Cohort is to help with development by easing the setup for new developers, and maintain consistency across all developers. Starting from scratch the steps should be:

1. Clone the repository
2. Install npm dependencies - this is an unfortunate 'catch 22' fix since Cohort is an npm package that can't be used till it is downloaded.
3. Run `cohort init` (#winning)
4. Start developing

# Libraries Being Used

* CoffeeScript (via Cake)
* JSHint - static analysis and cyclomatic complexity
* LibSass - CSS preprocessor
* Less - CSS preprocessor
* Mocha - unit testing
* Uglify - compression

