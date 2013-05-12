module test {
    module inner {
        var a = 123
        export a
    }
    import a from inner
    export a
}

import a from test
module.exports = a