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

function asyncCompile(content, filename, options, callback) {
  var result;
  try {
    result = compiler.compile(content, filename, options);
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


  async.map(srcs, function(src, callback) {
    var content = grunt.file.read(src).toString('utf8');
    compile(content, src, options, callback);
  }, function(err, result) {
    if (err) {
      grunt.log.error(err);
      callback(false);
    } else {
      var compiled = result.join('');
      grunt.log.debug('Compilation successful - ' + dest);
      grunt.file.write(dest, compiled, {encoding: 'utf8'});
      grunt.log.ok(srcs + ' -> ' + dest);
      callback(true);
    }
  });
}

module.exports = function(grunt) {
  grunt.registerMultiTask('traceur',
    'Compile ES6 JavaScript to ES3 JavaScript', function() {
      var options = this.options({
        sourceMaps: false,
        spawn: true
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
