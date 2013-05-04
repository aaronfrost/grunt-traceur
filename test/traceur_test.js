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

function getType (obj) {
  return Object.prototype.toString.call(obj)
}

exports.traceur = {

  args: function (test) {
    var func = require('./tmp/args');
    var result = func(undefined, 1, 2, 3);
    test.equal(result.a, 100, 'default argument should work');
    var restType = getType(result.rest);
    test.equal(restType, '[object Array]', 'rest arguments should be converted to an array')
    test.done();
  },

  destructuring: function (test) {
    var vals = require('./tmp/destructuring');
    test.equal(vals.a, 'This is A', 'destructuring assignment should work');
    test.equal(vals.b, 'This is B', 'destructuring assignment should work');
    test.done();
  },

  module: function (test) {
    var a = require('./tmp/module');
    test.equal(a, 123, 'module and import should work');
    test.done();
  },

  class: function (test) {
    var Man = require('./tmp/class');
    var name = 'john';
    var man = new Man(name);
    var msg = man.hi()
    test.equal(msg, 'I am a man and my name is ' + name, 'class and inheritance should work')
    test.done()
  }

};
