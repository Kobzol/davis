"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var Enter = (function (_super) {
    __extends(Enter, _super);
    function Enter() {
        _super.apply(this, arguments);
    }
    Enter.prototype.execute = function (cpu) {
        cpu.push(cpu.getRegisterByName("EBP").getValue());
        cpu.getRegisterByName("EBP").setValue(cpu.getRegisterByName("ESP").getValue());
        return cpu.getNextInstruction();
    };
    return Enter;
}(instruction_1.Instruction));
exports.Enter = Enter;
var Leave = (function (_super) {
    __extends(Leave, _super);
    function Leave() {
        _super.apply(this, arguments);
    }
    Leave.prototype.execute = function (cpu) {
        cpu.getRegisterByName("EBP").setValue(cpu.pop());
        return cpu.getNextInstruction();
    };
    return Leave;
}(instruction_1.Instruction));
exports.Leave = Leave;
var Call = (function (_super) {
    __extends(Call, _super);
    function Call() {
        _super.apply(this, arguments);
    }
    Call.prototype.execute = function (cpu) {
        cpu.push(cpu.eip + 1);
        return this.target.getValue();
    };
    return Call;
}(instruction_1.UnaryReadOperation));
exports.Call = Call;
var Return = (function (_super) {
    __extends(Return, _super);
    function Return() {
        _super.apply(this, arguments);
    }
    Return.prototype.execute = function (cpu) {
        return cpu.pop();
    };
    return Return;
}(instruction_1.Instruction));
exports.Return = Return;
//# sourceMappingURL=retcall.js.map