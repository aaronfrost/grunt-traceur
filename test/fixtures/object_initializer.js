var x = 10;
var y = 5;

export var obj = {
    x,
    y,
    add() {
        return this.x + this.y;
    }
};
