/*
* grunt-traceur
* https://github.com/aaron/grunt
*
* Copyright (c) 2013 Aaron Frost
* Licensed under the MIT license.
*/

'use strict';
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var compiler = require('../lib/compiler');
var Promise = require('es6-promise').Promise;
var RUNTIME_PATH = (function () {
  return require('traceur').RUNTIME_PATH;
})();

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

/*
* Compiles one file
*/
function compileOne (grunt, compile, src, dest, options) {
  return new Promise(function (resolve, reject) {
    if (src.length > 1) {
      var error = new Error('source MUST be a single file OR multiple files using ' +
        'expand:true. Check out the README.');
      reject(error.message);
    }
    src = src[0];
    var content = grunt.file.read(src).toString('utf8');

    if(options.stripExtension){
      dest = dest.replace(options.stripExtension, '');
    }

    options.filename = src;
    options.sourceName = src;
    options.outputName = dest;

    if (options.moduleNames) {
      options.moduleName = [
        path.dirname(dest),
        path.sep,
        path.basename(dest, path.extname(dest))
      ].join('');
      var stripPrefix = options.moduleNaming.stripPrefix;
      if (stripPrefix) {
        var namePrefixMatched = (stripPrefix + path.sep) ===
          options.moduleName.substring(0, stripPrefix.length + path.sep.length);
        if (namePrefixMatched) {
          options.moduleName =
            options.moduleName.substring(stripPrefix.length + path.sep.length);
        }
      }
      var addPrefix = options.moduleNaming.addPrefix;
      if (addPrefix) {
        options.moduleName = addPrefix + path.sep + options.moduleName;
      }
    }
    compile(content, options, function (err, result) {
      var sourceMapName, sourceMapPath;
      if (err) {
        grunt.log.error(src + ' -> ' + dest);
        reject(err);
      } else {
        if (options.sourceMaps) {
          sourceMapName = path.basename(src, path.extname(src)) + '.map';
          sourceMapPath = path.join(dest, '..',  sourceMapName);
          grunt.file.write(sourceMapPath, result[1]);
          grunt.log.debug('SourceMap written to "' + sourceMapName + '"');
        }
        grunt.file.write(dest, result[0], {
          encoding: 'utf8'
        });
        grunt.log.debug('Compiled successfully to "' + dest + '"');
        grunt.log.ok(src + ' -> ' + dest);
        resolve();
      }
    });
  });
}

module.exports = function(grunt) {
  grunt.registerMultiTask('traceur',
    'Compile ES6 JavaScript to ES5 JavaScript', function() {
      var options = this.options({
        moduleNames: true,
        moduleNaming: {
          stripPrefix: "",
          addPrefix: ""
        }
      });
      grunt.log.debug('using options: ' + JSON.stringify(options));
      var done = this.async();
      // we use a flag so that every errors are printed out
      // instead of quitting at the first one
      var success = true;
      var server, compile;

      if (options.spawn) {
        server = compiler.server();
        compile = server.compile;
      } else {
        compile = asyncCompile;
      }
      delete options.spawn;
      if (!this.files.length) {
        grunt.log.error('none of the listed sources are valid');
        success = false;
      }

      //Warn about deprecation of 'includeRuntime'
      if(!_.isUndefined(options.includeRuntime)){
        grunt.log.error('The use of \'includeRuntime\' has been deprecated in favor of \'copyRuntime\' as of grunt-traceur@0.5.1. The traceur_runtime.js was not included. Please update your options and retry.');
      }

      if(options.stripExtension){
        if(options.stripExtension.charAt(0) !== '.'){
          options.stripExtension = '.' + options.stripExtension;
        }

        options.stripExtension.replace(/\./g, '\\\\.')
        options.stripExtension = new RegExp(options.stripExtension + '$', 'i');
      }

      Promise
        .all(this.files.map(function (group) {
          return compileOne(grunt, compile, group.src, group.dest, options)
            .catch(function (err) {
              grunt.log.error('ERRORS:');
              grunt.log.error(err);
              success = false;
            });
        }))
        .then(function () {
          var runtime, runtimeFilename;
          if (server) {
            server.stop();
          }
          if(!_.isUndefined(options.copyRuntime)){
            if(_.isEmpty(options.copyRuntime)){
              grunt.log.error('Unable to perform \'copyRuntime\' because the value is not specified.');
              return;
            }
            runtime = fs.readFileSync(RUNTIME_PATH);
            runtimeFilename = path.join(options.copyRuntime, 'traceur_runtime.js')
            grunt.file.write(runtimeFilename, runtime, {
              encoding: 'utf8'
            });
            grunt.log.ok('TRACEUR_RUNTIME.JS -> ' + runtimeFilename);
          }
          done(success);
        });
    });
};
