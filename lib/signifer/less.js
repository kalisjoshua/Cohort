/*jshint strict:false*/
/*globals module require*/

var less = require('less');

module.exports = function (munifex) {
  return function signifer_less (path, input, done) {
    try {
      less.Parser({paths: ["./" + path.split("/").slice(0, -1).join("/")]})
        .parse(input, function (err, tree) {
          if (err) {
            munifex("Parse error " + path);
            throw err;
          } else {
            done(tree.toCSS({compress: true}));
          }
        });
    } catch (err) {
      munifex("Read error " + path);
      throw err;
    }
  };
};
