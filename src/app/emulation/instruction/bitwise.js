"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var And = (function (_super) {
    __extends(And, _super);
    function And() {
        _super.apply(this, arguments);
    }
    And.prototype.execute = function (cpu) {
        this.target.setValue(cpu.alu.and(this.target.getValue(), this.source.getValue()));
        return cpu.getNextInstruction();
    };
    return And;
}(instruction_1.BinaryOperation));
exports.And = And;
var Or = (function (_super) {
    __extends(Or, _super);
    function Or() {
        _super.apply(this, arguments);
    }
    Or.prototype.execute = function (cpu) {
        this.target.setValue(cpu.alu.or(this.target.getValue(), this.source.getValue()));
        return cpu.getNextInstruction();
    };
    return Or;
}(instruction_1.BinaryOperation));
exports.Or = Or;
var Xor = (function (_super) {
    __extends(Xor, _super);
    function Xor() {
        _super.apply(this, arguments);
    }
    Xor.prototype.execute = function (cpu) {
        this.target.setValue(cpu.alu.xor(this.target.getValue(), this.source.getValue()));
        return cpu.getNextInstruction();
    };
    return Xor;
}(instruction_1.BinaryOperation));
exports.Xor = Xor;
//# sourceMappingURL=bitwise.js.map