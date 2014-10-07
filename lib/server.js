'use strict';
var compile = require('./compiler').compile;

process.on('message', function(msg) {
  compile(msg.src, msg.dest, msg.options)
    .then(function () {
      process.send({
        id: msg.id
      });
    })
    .catch(function (err) {
      process.send({
        id: msg.id,
        error: err
      });
    });
});
