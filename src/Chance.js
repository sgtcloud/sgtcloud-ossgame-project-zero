/**
 * Created by highkay on 2016/1/19.
 */
/**
 * `Chance` Constructor
 * @param {Array} opts [containing weighted funcs]
 *
 * Example: [{
 *     w: 60,
 *     f: function (v) {
 *         console.log('Weight 60');
 *     }
 *  }]
 */
var Chance = function(opts) {
    this._stack = opts;
    this._found = new Array();

    this._stack.sort(function (a, b) {
        return a.w - b.w;
    }).reduce(function (a, b) {
        b.cw = b.w + a;
        return a + b.w;
    }, 0);
};


/**
 * `Generate` Random number
 *
 * @api private
 */
Chance.prototype.random = function() {
    var random = ~~ (Math.random() * 100);

    while (this._found.indexOf(random) === -1) {
        random = ~~ (Math.random() * 100);
        this._found.push(random);
    };

    if (this._found.length === 100) {
        this._found.length = 0;
    };
    return random;
}


/**
 * `Get` next function, according to weight
 *
 * @return {Function} [executed]
 */
Chance.prototype.next = function() {
    var random = this.random();

    for (var i = 0; i < this._stack.length; i++) {
        if (random <= this._stack[i].cw) {
            this._stack[i].f.apply(this, arguments);
            break;
        }
    };
};