import {a as moduleA, b} from './destructuring';
module m from './destructuring';
export var text = [moduleA, b, m.a, m.b].join(', ');