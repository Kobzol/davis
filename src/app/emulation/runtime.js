"use strict";
var Runtime = (function () {
    function Runtime() {
        this._process = null;
    }
    Object.defineProperty(Runtime.prototype, "process", {
        get: function () {
            return this._process;
        },
        set: function (process) {
            this._process = process;
        },
        enumerable: true,
        configurable: true
    });
    Runtime.prototype.hasProcess = function () {
        return this.process !== null;
    };
    return Runtime;
}());
exports.Runtime = Runtime;
//# sourceMappingURL=runtime.js.map