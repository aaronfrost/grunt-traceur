/*
* grunt-traceur
* https://github.com/aaron/grunt
*
* Copyright (c) 2013 Aaron Frost
* Licensed under the MIT license.
*/

'use strict';
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
function compileOne (grunt, compile, sourceBasePackage, distBasePackage, src,
  dest, options) {
  return new Promise(function (resolve, reject) {
    if (src.length > 1) {
      reject(Error('source MUST be a single file OR multiple files using ' +
        'expand:true. Check out the README.'));
    }
    src = src[0];
    var content = grunt.file.read(src).toString('utf8');
    options.filename = src;
    if (options.moduleNames) {
      options.moduleName = [
        path.dirname(src),
        path.sep,
        path.basename(src, path.extname(src))
      ].join('');
      var basePackageMatched =
        options.moduleName.substring(0, sourceBasePackage.length + 1) ===
        (sourceBasePackage + path.sep);
      if (sourceBasePackage && basePackageMatched) {
        options.moduleName =
          options.moduleName.substring(sourceBasePackage.length + 1);
      }
      if (distBasePackage) {
        options.moduleName = distBasePackage + path.sep + options.moduleName;
      }
    }
    compile(content, options, function (err, result) {
      var sourceMapName, sourceMapPath;
      if (err) {
        grunt.log.error(src + ' -> ' + dest);
        grunt.log.error('ERRORS:');
        grunt.log.error(err);
        reject(err);
      } else {
        if (options.includeRuntime) {
          result[0] = fs.readFileSync(RUNTIME_PATH) + result[0];
        }
        if (options.sourceMaps) {
          sourceMapName = path.basename(src) + '.map';
          sourceMapPath = path.join(dest, '..',  sourceMapName);
          result[0] += '//# sourceMappingURL=' + sourceMapName + '\n';
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
        moduleNames: true
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
      Promise
        .all(this.files.map(function (group) {
          var sourceBasePackage = options.sourceBasePackage || "";
          var distBasePackage = options.distBasePackage || "";
          return compileOne(grunt, compile, sourceBasePackage, distBasePackage,
            group.src, group.dest, options)
            .catch(function () {
              success = false;
            });
        }))
        .then(function () {
          if (server) {
            server.stop();
          }
          done(success);
        });
    });
};
