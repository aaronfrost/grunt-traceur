'use strict';
var fork = require('child_process').fork;
var os = require('os');

var gruntOnlyOptions = ['includeRuntime', 'moduleNames'];

function getTraceurOptions(options) {
  var traceurOptions = {};
  var keys = Object.keys(options).filter(function(key) {
    return gruntOnlyOptions.indexOf(key) === -1;
  });

  keys.forEach(function(key) {
    traceurOptions[key] = options[key];
  });

  return traceurOptions;
}

/**
 * @param {string} content js source.
 * @param {Object} options traceur config.
 * @return {string} compiled js source.
 */
exports.compile = function(content, options) {
  // import lazzily as traceur pollutes the global namespace.
  var traceur = require('traceur');
  var sourceMap = '';
  var compiler, result;

  compiler = new traceur.NodeCompiler(getTraceurOptions(options));

  try {
    result = compiler.compile(content, options.sourceName, options.outputName);

    if (options.sourceMaps) {
      sourceMap = compiler.getSourceMap();
    }
  } catch (e) {
    throw new Error(e);
  }

  return [result, sourceMap];
};

/**
*/
exports.server = function() {

  var server;
  var msgId = 0;
  var listeners = {};

  function spawnServer() {
    server = fork(__dirname + '/server.js');
    server.on('message', onMessage);
    server.on('error', function(err) {
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

  /**
  * @param {string} content js source.
  * @param {Object} options traceur config.
  * @param {function(string, string)} callback that is called with an error
  * message (if any) and the compiled source.
  */
  api.compile = function(content, options, callback) {
    var id = msgId++;
    listeners[id] = function(msg) {
      if (msg.error) {
        callback(msg.error);
      } else {
        callback(null, msg.result);
      }
    };
    server.send({content: content,
      options: options,
      id: id});
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
