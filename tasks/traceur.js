/*
* grunt-traceur
* https://github.com/aaronfrost/grunt-traceur
*
* Copyright (c) 2013 Aaron Frost
* Licensed under the MIT license.
*/

'use strict';
var Promise = require('es6-promise').Promise;
var compiler = require('../lib/compiler');

/**
 * initialization of variables used in inner scopes
 */
var options, compile, success;

/**
 * logger interface
 */
var logger = {
  ok: undefined,
  debug: undefined,
  error: undefined
};

/**
 * executes after file compilation succeeded
 */
var onCompileSuccess = function (src, dest) {
  logger.debug('Compiled successfully to "' + dest + '"');
  logger.ok(src + ' -> ' + dest);
};

/**
 * executes after file compilation failed
 */
var onCompileError = function (src, dest, err) {
  logger.error(src + ' -> ' + dest);
  logger.error(err);
  success = false;
};

/**
 * validates group and returns compile promise (or throws if not valid)
 */
var getCompilePromise = function (group) {
  if (group.src.length > 1) {
    throw new Error('source MUST be a single file OR multiple files using expand:true. ' +
      'Check out the README.');
  }
  var src = group.src[0];
  var dest = group.dest;
  return compile(src, dest, options)
    .then(onCompileSuccess.bind(null, src, dest))
    .catch(onCompileError.bind(null, src, dest));
};

var traceurTask = function () {
  var server, promise;
  var done = this.async();
  options = this.options();
  logger.debug('using options: ' + JSON.stringify(options));
  if (options.spawn) {
    server = compiler.server();
    compile = server.compile;
  } else {
    compile = compiler.compile;
  }
  delete options.spawn;
  success = true;
  // recursive compilation has to be serial because it uses `process.chdir` internally
  if (options.recursive) {
    promise = this.files.reduce(function (prev, next) {
      return prev.then(function () {
        return getCompilePromise(next);
      });
    }, Promise.resolve());
  } else {
    promise = Promise.all(this.files.map(getCompilePromise));
  }
  promise.then(function () {
    if (server) {
      server.stop();
    }
    done(success);
  });
};

module.exports = function(grunt) {
  global.grunt = grunt;
  logger = grunt.log;
  grunt.registerMultiTask('traceur',
    'Compile ES6 JavaScript to ES5 JavaScript', traceurTask);
};
