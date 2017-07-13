"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var SetDirection = (function (_super) {
    __extends(SetDirection, _super);
    function SetDirection() {
        _super.apply(this, arguments);
    }
    SetDirection.prototype.execute = function (cpu) {
        cpu.statusWord.direction = true;
        return cpu.getNextInstruction();
    };
    return SetDirection;
}(instruction_1.Instruction));
exports.SetDirection = SetDirection;
var ClearDirection = (function (_super) {
    __extends(ClearDirection, _super);
    function ClearDirection() {
        _super.apply(this, arguments);
    }
    ClearDirection.prototype.execute = function (cpu) {
        cpu.statusWord.direction = false;
        return cpu.getNextInstruction();
    };
    return ClearDirection;
}(instruction_1.Instruction));
exports.ClearDirection = ClearDirection;
var SetCarry = (function (_super) {
    __extends(SetCarry, _super);
    function SetCarry() {
        _super.apply(this, arguments);
    }
    SetCarry.prototype.execute = function (cpu) {
        cpu.statusWord.carry = true;
        return cpu.getNextInstruction();
    };
    return SetCarry;
}(instruction_1.Instruction));
exports.SetCarry = SetCarry;
var ClearCarry = (function (_super) {
    __extends(ClearCarry, _super);
    function ClearCarry() {
        _super.apply(this, arguments);
    }
    ClearCarry.prototype.execute = function (cpu) {
        cpu.statusWord.carry = false;
        return cpu.getNextInstruction();
    };
    return ClearCarry;
}(instruction_1.Instruction));
exports.ClearCarry = ClearCarry;
//# sourceMappingURL=flags.js.map