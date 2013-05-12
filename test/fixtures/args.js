function test(a = 100, ...rest){
  return {
    a: a,
    rest: rest
  }
}

module.exports = test