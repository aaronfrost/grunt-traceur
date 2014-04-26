var fork = require('child_process').fork;
var os = require('os');

/**
 * @param {string} content js source.
 * @param {Object} options traceur config.
 * @return {string} compiled js source.
 */
exports.compile = function(content, options) {
  // import lazzily as traceur pollutes the global namespace.
  var traceur = require('traceur');
  if (options.includeRuntime) {
    content = "import '" + traceur.RUNTIME_PATH + "';" + content;
  }
  var result = traceur.compile(content, options);
  if (result.errors.length) {
    throw new Error(result.errors.join(os.EOL));
  }
  return result;
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
