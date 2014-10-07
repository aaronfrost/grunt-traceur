'use strict';
var fork = require('child_process').fork;
var fs = require('fs');
var os = require('os');
var path = require('path');
var Promise = require('es6-promise').Promise;
var traceur = require('traceur');
var cwd = process.cwd();

var compileSingleFile = function (src, dest, options) {
  return new Promise(function (resolve, reject) {
    options.moduleName = [path.dirname(src), path.sep, path.basename(src, path.extname(src))].join('').replace(path.sep, '_');
    var compiler = new traceur.NodeCompiler(options);
    var content = fs.readFileSync(src, 'utf-8');
    try {
      var result = compiler.compile(content);
      if (options.sourceMaps) {
        var sourceMapName = path.basename(src, path.extname(src)) + '.map';
        var sourceMapPath = path.join(dest, '..',  sourceMapName);
        result += '//# sourceMappingURL=' + sourceMapName + os.EOL;
        fs.writeFileSync(sourceMapPath, compiler.getSourceMap(), 'utf-8');
      }
      fs.writeFileSync(dest, result, 'utf-8');
      process.nextTick(resolve);
    } catch (e) {
      reject(new Error(e));
    }
  });
};

var compileRecursive = function (src, dest, options) {
  src = path.join(cwd, src);
  dest = path.join(cwd, dest);
  var rootSource = {
    name: src,
    type: options.script ? 'script' : 'module'
  };
  traceur.System.baseURL = cwd;
  return traceur.recursiveModuleCompileToSingleFile(dest, [rootSource], options);
};

// global options
var compileFunction = compileSingleFile;

exports.compile = function(src, dest, options) {
  if (typeof options.recursive !== 'undefined') {
    if (options.recursive) {
      compileFunction = compileRecursive;
    }
    delete options.recursive;
  }
  return compileFunction(src, dest, options);
};

exports.server = function() {

  var server;
  var msgId = 0;
  var listeners = {};

  function spawnServer() {
    server = fork(__dirname + '/server.js');
    server.on('message', onMessage);
    server.on('error', function (err) {
      console.error('server error: ' + err);
    });
  }

  function onMessage(msg) {
    var listener = listeners[msg.id];
    if (listener) {
      delete listeners[msg.id];
      listener(msg);
    }
  }

  var api = {};

  api.compile = function (src, dest, options) {
    return new Promise(function (resolve, reject) {
      var id = msgId++;
      listeners[id] = function(msg) {
        if (msg.error) {
          reject(msg.error);
        } else {
          resolve(msg.result);
        }
      };
      server.send({
        src: src,
        dest: dest,
        options: options,
        id: id
      });
    });
  };

  /**
   * stop the server
   */
  api.stop = function() {
    server.disconnect();
  };

  spawnServer();
  return api;
};
