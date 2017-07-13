"use strict";
var memory_view_1 = require("./memory-view");
var MemoryBlock = (function () {
    function MemoryBlock(size) {
        this._data = new ArrayBuffer(size);
    }
    MemoryBlock.prototype.load = function (address, size, signed) {
        if (size === void 0) { size = 4; }
        if (signed === void 0) { signed = false; }
        return new memory_view_1.MemoryView(this, size, address, signed);
    };
    MemoryBlock.prototype.isValid = function (address) {
        return address >= 0 && address < this.size;
    };
    MemoryBlock.prototype.clear = function () {
        for (var i = 0; i < this.size; i++) {
            this.load(i, 1).setValue(0);
        }
    };
    Object.defineProperty(MemoryBlock.prototype, "data", {
        get: function () { return this._data; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MemoryBlock.prototype, "size", {
        get: function () { return this.data.byteLength; },
        enumerable: true,
        configurable: true
    });
    return MemoryBlock;
}());
exports.MemoryBlock = MemoryBlock;
//# sourceMappingURL=memory-block.js.map