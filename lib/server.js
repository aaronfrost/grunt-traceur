var compile = require('./compiler').compile;

process.on('message', function(msg) {
  try {
    var compiled = compile(msg.content, msg.filename, msg.options);
    process.send({id: msg.id, result: compiled});
  } catch (e) {
    process.send({id: msg.id, error: e.message });
  }
});

