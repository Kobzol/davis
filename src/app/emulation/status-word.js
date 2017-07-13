"use strict";
var StatusWord = (function () {
    function StatusWord() {
        this._carry = false;
        this._zero = false;
        this._overflow = false;
        this._signum = false;
        this._parity = false;
        this._direction = false;
    }
    Object.defineProperty(StatusWord.prototype, "carry", {
        get: function () {
            return this._carry;
        },
        set: function (value) {
            this._carry = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatusWord.prototype, "zero", {
        get: function () {
            return this._zero;
        },
        set: function (value) {
            this._zero = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatusWord.prototype, "overflow", {
        get: function () {
            return this._overflow;
        },
        set: function (value) {
            this._overflow = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatusWord.prototype, "signum", {
        get: function () {
            return this._signum;
        },
        set: function (value) {
            this._signum = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatusWord.prototype, "parity", {
        get: function () {
            return this._parity;
        },
        set: function (value) {
            this._parity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatusWord.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            this._direction = value;
        },
        enumerable: true,
        configurable: true
    });
    StatusWord.prototype.toString = function () {
        return "[CF: " + this.carry + ", ZF: " + this.zero + ", OF: " + this.overflow
            + " SF: " + this.signum + ", DF: " + this.direction + "]";
    };
    return StatusWord;
}());
exports.StatusWord = StatusWord;
//# sourceMappingURL=status-word.js.map