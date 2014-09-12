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
    test.equal(man.firstInitial, 'j', 'computed properties should work');
    test.done();
  },

  arrow: function(test) {
    var arrow = require('./tmp/arrow');
    test.equal(arrow.pi(), 3.1415);
    test.equal(arrow.square(5), 25);
    test.equal(arrow.greater(4, 1), true);
    test.equal(arrow.greater(1, 4), false);
    test.done();
  },

  forOf: function(test) {
    var sum = require('./tmp/for_of').sum;
    test.equal(sum([1, 2, 3, 4]), 10);
    test.done();
  },

  generator: function(test) {
    var range = require('./tmp/generator').generator.range;
    var gen = range(0, 10, 2);
    var item = gen.next();
    for (var i = 0; !item.done; i += 2) {
      test.equal(item.value, i);
      item = gen.next();
    }
    test.done();
  },

  generatorComprehension: function(test) {
    var squareSum = require('./tmp/generator').generator.squareSum;
    test.equal(squareSum([1, 2, 3, 4]), 30);
    test.done();
  },

  arrayComprehension: function(test) {
    var squared = require('./tmp/array').squared;
    test.deepEqual(squared([1, 2, 3, 4]), [1, 4, 9, 16]);
    test.done();
  },

  numericLiteral: function(test) {
    var nums = require('./tmp/numeric_literal').nums;
    test.deepEqual(nums, [3, 15]);
    test.done();
  },

  templateLiteral: function(test) {
    var literal = require('./tmp/template_literal').literal;
    test.equal(literal, 'My name is John Smith.');
    test.done();
  },

  objectInitializer: function(test) {
    var obj = require('./tmp/object_initializer').obj;
    test.equal(obj.x, 10);
    test.equal(obj.y, 5);
    test.equal(obj.add(), 15);
    test.done();
  },

  sourceMaps: function (test) {
    var regex = /\.map$/i;
    var files = fs.readdirSync(path.join(__dirname, 'tmp')).filter(function (filename) {
      return regex.test(filename);
    });

    files.forEach(function(file) { //make sure the files have contents
      test.ok(
        fs.readFileSync(path.join(__dirname, 'tmp', file), 'utf-8')
      );
    });
    test.equal(files.length, 11);
    test.done();
  }
};
