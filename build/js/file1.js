var $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var a = 1;
var $__1 = {
  b: 'This Is B',
  c: 'This Is C'
}, b = $__1.b, c = $__1.c;
var Hello = function() {
  var $Hello = ($__createClassNoExtends)({constructor: function(greeting) {
      this.greeting = greeting;
    }}, {});
  return $Hello;
}();
