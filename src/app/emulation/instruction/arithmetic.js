"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var runtime_exception_1 = require("../runtime-exception");
var Add = (function (_super) {
    __extends(Add, _super);
    function Add() {
        _super.apply(this, arguments);
    }
    Add.prototype.execute = function (cpu) {
        this.target.setValue(cpu.alu.add(this.target.getValue(), this.source.getValue()));
        return cpu.getNextInstruction();
    };
    return Add;
}(instruction_1.BinaryOperation));
exports.Add = Add;
var AddWithCarry = (function (_super) {
    __extends(AddWithCarry, _super);
    function AddWithCarry() {
        _super.apply(this, arguments);
    }
    AddWithCarry.prototype.execute = function (cpu) {
        this.target.setValue(cpu.alu.add(this.target.getValue(), this.source.getValue(), cpu.statusWord.carry ? 1 : 0));
        return cpu.getNextInstruction();
    };
    return AddWithCarry;
}(Add));
exports.AddWithCarry = AddWithCarry;
var Sub = (function (_super) {
    __extends(Sub, _super);
    function Sub() {
        _super.apply(this, arguments);
    }
    Sub.prototype.execute = function (cpu) {
        this.target.setValue(cpu.alu.sub(this.target.getValue(), this.source.getValue()));
        return cpu.getNextInstruction();
    };
    return Sub;
}(instruction_1.BinaryOperation));
exports.Sub = Sub;
var SubWithBorrow = (function (_super) {
    __extends(SubWithBorrow, _super);
    function SubWithBorrow() {
        _super.apply(this, arguments);
    }
    SubWithBorrow.prototype.execute = function (cpu) {
        this.target.setValue(cpu.alu.sub(this.target.getValue(), this.source.getValue(), cpu.statusWord.carry ? 1 : 0));
        return cpu.getNextInstruction();
    };
    return SubWithBorrow;
}(Sub));
exports.SubWithBorrow = SubWithBorrow;
var Increment = (function (_super) {
    __extends(Increment, _super);
    function Increment() {
        _super.apply(this, arguments);
    }
    Increment.prototype.execute = function (cpu) {
        this.target.setValue(cpu.alu.inc(this.target.getValue()));
        return cpu.getNextInstruction();
    };
    return Increment;
}(instruction_1.UnaryWriteOperation));
exports.Increment = Increment;
var Decrement = (function (_super) {
    __extends(Decrement, _super);
    function Decrement() {
        _super.apply(this, arguments);
    }
    Decrement.prototype.execute = function (cpu) {
        this.target.setValue(cpu.alu.dec(this.target.getValue()));
        return cpu.getNextInstruction();
    };
    return Decrement;
}(instruction_1.UnaryWriteOperation));
exports.Decrement = Decrement;
var DivideSigned = (function (_super) {
    __extends(DivideSigned, _super);
    function DivideSigned() {
        _super.apply(this, arguments);
    }
    DivideSigned.prototype.execute = function (cpu) {
        if (this.target.getValue() === 0) {
            throw new runtime_exception_1.RuntimeException("Division by zero");
        }
        var edx = cpu.getRegisterByName("EDX").getValue();
        var eax = cpu.getRegisterByName("EAX").getValue();
        var value = cpu.alu.extend64bit(eax, edx);
        var result = cpu.alu.idivide(value, this.target.getValue());
        cpu.getRegisterByName("EDX").setValue(result.remainder);
        cpu.getRegisterByName("EAX").setValue(result.value);
        return cpu.getNextInstruction();
    };
    return DivideSigned;
}(instruction_1.UnaryReadOperation));
exports.DivideSigned = DivideSigned;
var MultiplySigned = (function (_super) {
    __extends(MultiplySigned, _super);
    function MultiplySigned() {
        _super.apply(this, arguments);
    }
    MultiplySigned.prototype.execute = function (cpu) {
        var eax = cpu.getRegisterByName("EAX").getValue();
        var result = cpu.alu.imultiply(eax, this.target.getValue());
        cpu.getRegisterByName("EDX").setValue(result.upperHalf);
        cpu.getRegisterByName("EAX").setValue(result.lowerHalf);
        return cpu.getNextInstruction();
    };
    return MultiplySigned;
}(instruction_1.UnaryReadOperation));
exports.MultiplySigned = MultiplySigned;
//# sourceMappingURL=arithmetic.js.map