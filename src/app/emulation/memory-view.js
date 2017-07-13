"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var memory_block_1 = require("./memory-block");
var GET_METHODS = {
    "1": ["getUint8", "getInt8"],
    "2": ["getUint16", "getInt16"],
    "4": ["getUint32", "getInt32"]
};
var SET_METHODS = {
    "1": ["setUint8", "setInt8"],
    "2": ["setUint16", "setInt16"],
    "4": ["setUint32", "setInt32"]
};
var MemoryView = (function () {
    function MemoryView(memory, byteSize, index, signed) {
        if (index === void 0) { index = 0; }
        if (signed === void 0) { signed = false; }
        this.memory = memory;
        this.byteSize = byteSize;
        this.index = index;
        this.signed = signed;
        this.view = new DataView(this.memory.data, index);
        var signedIndex = signed ? 1 : 0;
        this.getMethod = GET_METHODS[byteSize.toString()][signedIndex];
        this.setMethod = SET_METHODS[byteSize.toString()][signedIndex];
    }
    MemoryView.prototype.setValue = function (value) {
        this.view[this.setMethod](0, value, true);
    };
    MemoryView.prototype.getValue = function () {
        return this.view[this.getMethod](0, true);
    };
    MemoryView.prototype.add = function (value) {
        this.setValue(this.getValue() + value);
    };
    MemoryView.prototype.getOffsetView = function (offset, byteSize, signed) {
        if (signed === void 0) { signed = false; }
        if (byteSize === undefined) {
            byteSize = this.byteSize;
        }
        return new MemoryView(this.memory, byteSize, this.index + offset, signed);
    };
    MemoryView.prototype.resize = function (size) {
        return new MemoryView(this.memory, size, this.index, this.signed);
    };
    Object.defineProperty(MemoryView.prototype, "size", {
        get: function () { return this.byteSize; },
        enumerable: true,
        configurable: true
    });
    return MemoryView;
}());
exports.MemoryView = MemoryView;
var NumericConstant = (function (_super) {
    __extends(NumericConstant, _super);
    function NumericConstant(value, byteSize, signed) {
        if (byteSize === void 0) { byteSize = 4; }
        if (signed === void 0) { signed = false; }
        _super.call(this, new memory_block_1.MemoryBlock(byteSize), byteSize, 0, signed);
        _super.prototype.setValue.call(this, value);
    }
    NumericConstant.prototype.setValue = function (value) {
        throw new Error("Numeric constant's value cannot be changed");
    };
    return NumericConstant;
}(MemoryView));
exports.NumericConstant = NumericConstant;
//# sourceMappingURL=memory-view.js.map