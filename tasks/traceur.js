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
var traceur = require('traceur');


/**
 * Compiles a list of srcs files
 * */
function compile(grunt, srcs, dest) {
  var project = new traceur.semantics.symbols.Project('/');
  var reporter = new traceur.util.ErrorReporter();
  reporter.reportMessageInternal = function(location, format, args) {
    throw new Error(
      global.traceur.util.ErrorReporter.format(location, format, args));
  };

  srcs.forEach(function(filename) {
    var data = grunt.file.read(filename).toString('utf8');
    var sourceFile = new traceur.syntax.SourceFile(filename, data);
    project.addFile(sourceFile);
  });

  grunt.log.debug('Compiling... ' + dest);
  try {
    var compiledObjectMap = traceur.codegeneration.Compiler.compile(
    reporter, project, false);
  } catch (e) {
    grunt.log.error(e.message);
    return false;
  }
  grunt.log.debug('Compilation successful - ' + dest);

  var writerConfig = {};
  var result = global.traceur.outputgeneration.ProjectWriter.write(
  compiledObjectMap, writerConfig);
  grunt.file.write(dest, result, {encoding: 'utf8'});
  grunt.log.ok(srcs + ' -> ' + dest);
  return true;
}

module.exports = function(grunt) {
  grunt.registerMultiTask('traceur',
    'Compile ES6 JavaScript to ES3 JavaScript', function() {
      var options = this.options({
        sourceMaps: false
      });
      grunt.log.debug('using options: ' + JSON.stringify(options));

      traceur.options.reset();
      for (var key in options) {
        traceur.options[key] = options[key];
      }

      // We don't terminate immediately on errors to log all error messages
      // before terminating.
      var success = true;
      this.files.forEach(function(group) {
        if (!compile(grunt, group.src, group.dest))
          success = false;
      });
      return success;
    });

};
