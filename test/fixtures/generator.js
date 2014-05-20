function* range(start, end, step) {
    while (start < end) {
        yield start;
        start += step;
    }
}

function squareSum(arr) {
    var comp = (for (x of arr) x * x);
    var sum = 0;
    for (var x2 of comp) {
        sum += x2;
    }
    return sum;
}

export var generator = {
    range: range,
    squareSum: squareSum
};
