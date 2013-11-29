var fork = require('child_process').fork;

/**
 * @param {string} content js source.
 * @param {string} file filename.
 * @param {Object} options traceur config.
 * @return {string} compiled js source.
 */
exports.compile = function(content, file, options) {
  // import lazzily as traceur pollutes the global namespace.
  var traceur = require('traceur');

  traceur.options.reset();
  for (var key in options) {
    traceur.options[key] = options[key];
  }

  var project = new traceur.semantics.symbols.Project('/');
  var reporter = new traceur.util.ErrorReporter();
  reporter.reportMessageInternal = function(location, format, args) {
    throw new Error(
      global.traceur.util.ErrorReporter.format(location, format, args));
  };

  var sourceFile = new traceur.syntax.SourceFile(file, content);
  project.addFile(sourceFile);

  var compiledObjectMap = traceur.codegeneration.Compiler.compile(
  reporter, project, false);

  var writerConfig = {};
  var result = global.traceur.outputgeneration.ProjectWriter.write(
  compiledObjectMap, writerConfig);
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
  * @param {string} file filename.
  * @param {Object} options traceur config.
  * @param {function(string, string)} callback that is called with an error
  * message (if any) and the compiled source.
  */
  api.compile = function(content, file, options, callback) {
    var id = msgId++;
    listeners[id] = function(msg) {
      if (msg.error) {
        callback(msg.error);
      } else {
        callback(null, msg.result);
      }
    };
    server.send({content: content,
      filename: file,
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
