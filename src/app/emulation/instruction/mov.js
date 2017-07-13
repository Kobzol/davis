"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var Move = (function (_super) {
    __extends(Move, _super);
    function Move() {
        _super.apply(this, arguments);
    }
    Move.prototype.execute = function (cpu) {
        this.target.setValue(this.source.getValue());
        return cpu.getNextInstruction();
    };
    Move.prototype.loadParameters = function (target, source) {
        this.target = target;
        this.source = source;
    };
    return Move;
}(instruction_1.BinaryOperation));
exports.Move = Move;
//# sourceMappingURL=mov.js.map