/*
* grunt-traceur
* https://github.com/aaron/grunt
*
* Copyright (c) 2013 Aaron Frost
* Licensed under the MIT license.
*/

'use strict';
var fs = require('fs'),
path = require('path');
var compiler = require('../lib/compiler');
var async = require('async');

function asyncCompile(content, options, callback) {
  var result;
  try {
    result = compiler.compile(content, options);
  } catch (e) {
    callback(e.message, null);
    return;
  }
  callback(null, result);
}

/**
* Compiles a list of srcs files
* */
function compileAll(grunt, compile, srcs, dest, options, callback) {
  grunt.log.debug('Compiling... ' + dest);
  var content = srcs.map(function (src) {
    return grunt.file.read(src).toString('utf8');
  }).join(';');
  options.filename = dest;
  compile(content, options, function(err, result) {
    var sourceMapName;
    if (err) {
      grunt.log.error(err);
      callback(false);
    } else {
      if (options.sourceMap) {
        sourceMapName = dest + '.map';
        result.js += '\n//# sourceMappingURL=' +
        path.basename(sourceMapName) + '\n';
        grunt.file.write(sourceMapName, result.sourceMap);
        grunt.log.debug('SourceMap written to "' + sourceMapName + '"');
      }
      grunt.file.write(dest, result.js, {encoding: 'utf8'});
      grunt.log.debug('Compiled successfully to "' + dest + '"');
      grunt.log.ok(srcs + ' -> ' + dest);
      callback(true);
    }
  });
}

module.exports = function(grunt) {
  grunt.registerMultiTask('traceur',
    'Compile ES6 JavaScript to ES5 JavaScript', function() {
      var options = this.options({
        sourceMap: true
      });
      grunt.log.debug('using options: ' + JSON.stringify(options));
      var done = this.async();
      var server, compile;

      if (options.spawn) {
        server = compiler.server();
        compile = server.compile;
      } else {
        compile = asyncCompile;
      }
      delete options.spawn;

      // We don't terminate immediately on errors to log all error messages
      // before terminating.
      async.every(this.files, function(group, callback) {
        compileAll(grunt, compile, group.src, group.dest, options, callback);
      }, function(success) {
        if (server) server.stop();
        done(success);
      });
    });
};
