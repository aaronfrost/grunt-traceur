function test() {
  var a = arguments[0] !== (void 0) ? arguments[0]: 100;
  var b = arguments[1] !== (void 0) ? arguments[1]: 200;
  for (var rest = [], $__2 = 2; $__2 < arguments.length; $__2++) rest[$__2 - 2] = arguments[$__2];
  console.log(a, b, rest);
}
