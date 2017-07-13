"use strict";
var runtime_exception_1 = require("./runtime-exception");
// TODO: reimplement the operations in bitwise manner
var ALU = (function () {
    function ALU(cpu) {
        this.cpu = cpu;
    }
    ALU.prototype.add = function (op1, op2, previousCarry) {
        if (previousCarry === void 0) { previousCarry = 0; }
        op1 = this.normalize(op1);
        op2 = this.normalize(op2);
        var result = 0;
        var carry = [previousCarry, 0];
        for (var i = 0; i < 32; i++) {
            carry[0] = carry[1];
            var value = (op1 & 1) + (op2 & 1) + carry[0];
            op1 >>= 1;
            op2 >>= 1;
            result |= (value % 2) << i;
            carry[1] = value / 2;
        }
        this.cpu.statusWord.carry = carry[1] === 1;
        this.cpu.statusWord.overflow = (carry[0] ^ carry[1]) === 1;
        this.cpu.setFlags(result);
        return this.normalize(result);
    };
    ALU.prototype.sub = function (op1, op2, previousCarry) {
        if (previousCarry === void 0) { previousCarry = 0; }
        return this.add(op1, this.normalize(-op2), previousCarry);
    };
    ALU.prototype.idivide = function (dividend, divisor) {
        dividend = this.normalize(dividend);
        divisor = this.normalize(divisor);
        if (divisor === 0) {
            throw new runtime_exception_1.RuntimeException("Division by zero");
        }
        return {
            value: this.normalize(dividend / divisor),
            remainder: this.normalize(dividend % divisor)
        };
    };
    ALU.prototype.imultiply = function (op1, op2) {
        op1 = this.normalize(op1);
        op2 = this.normalize(op2);
        var result = op1 * op2;
        var lowerHalf = result & 0xFFFFFFFF;
        var upperHalf = result / Math.pow(2, 32);
        return {
            lowerHalf: this.normalize(lowerHalf),
            upperHalf: this.normalize(upperHalf)
        };
    };
    ALU.prototype.inc = function (value) {
        value = this.normalize(value);
        return this.normalize(value + 1);
    };
    ALU.prototype.dec = function (value) {
        value = this.normalize(value);
        return this.normalize(value - 1);
    };
    ALU.prototype.and = function (op1, op2) {
        var result = op1 & op2;
        this.cpu.setFlags(result);
        this.cpu.statusWord.overflow = false;
        this.cpu.statusWord.carry = false;
        return result;
    };
    ALU.prototype.or = function (op1, op2) {
        var result = op1 | op2;
        this.cpu.setFlags(result);
        this.cpu.statusWord.overflow = false;
        this.cpu.statusWord.carry = false;
        return result;
    };
    ALU.prototype.xor = function (op1, op2) {
        var result = op1 ^ op2;
        this.cpu.setFlags(result);
        this.cpu.statusWord.overflow = false;
        this.cpu.statusWord.carry = false;
        return result;
    };
    ALU.prototype.extend64bit = function (lowerHalf, upperHalf) {
        lowerHalf = this.normalize(lowerHalf);
        upperHalf = this.normalize(upperHalf);
        return this.normalize(upperHalf * (Math.pow(2, 32)) + lowerHalf);
    };
    ALU.prototype.normalize = function (value) {
        return value | 0;
    };
    return ALU;
}());
exports.ALU = ALU;
//# sourceMappingURL=alu.js.map