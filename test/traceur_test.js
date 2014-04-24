'use strict';

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var fs = require('fs');
var path = require('path');

function getType (obj) {
  return Object.prototype.toString.call(obj)
}

exports.traceur = {

  args: function (test) {
    var func = require('./tmp/args').test;
    var result = func(undefined, 1, 2, 3);
    test.equal(result.a, 100, 'default argument should work');
    var restType = getType(result.rest);
    test.equal(restType, '[object Array]', 'rest arguments should be converted to an array');
    test.done();
  },

  destructuring: function (test) {
    var vals = require('./tmp/destructuring');
    test.equal(vals.a, 'This is A', 'destructuring assignment should work');
    test.equal(vals.b, 'This is B', 'destructuring assignment should work');
    test.done();
  },

  module: function (test) {
    var module = require('./tmp/module');
    test.equal(module.text, 'This is A, This is B, This is A, This is B',
      'module, import and export should work');
    test.done();
  },

  class: function (test) {
    var Man = require('./tmp/class').Man;
    var name = 'john';
    var man = new Man(name);
    var msg = man.hi();
    test.equal(msg, 'I am a man and my name is ' + name, 'class and inheritance should work');
    test.done();
  },

  sourceMaps: function (test) {
    var regex = /\.map$/i;
    var files = fs.readdirSync(path.join(__dirname, 'tmp')).filter(function (filename) {
      return regex.test(filename);
    });
    test.equal(files.length, 5);
    test.done();
  },

  argsAndDestructuringInSameFile: function (test) {
    var all = require('./tmp/all');
    var func = all.test;
    var result = func(undefined, 1, 2, 3);
    test.equal(result.a, 100, 'default argument should work');
    var restType = getType(result.rest);
    test.equal(restType, '[object Array]', 'rest arguments should be converted to an array');
    test.equal(all.a, 'This is A', 'destructuring assignment should work');
    test.equal(all.b, 'This is B', 'destructuring assignment should work');
    test.done();
  }

};
