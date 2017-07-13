"use strict";
var cpu_1 = require("../app/emulation/cpu");
var memory_block_1 = require("../app/emulation/memory-block");
var runtime_exception_1 = require("../app/emulation/runtime-exception");
describe("ALU", function () {
    var cpu;
    var alu;
    beforeEach(function () {
        cpu = new cpu_1.CPU(null, new memory_block_1.MemoryBlock(256));
        alu = cpu.alu;
    });
    it('Sets zero flag', function () {
        alu.add(0, 0);
        expect(cpu.statusWord.zero).toBeTruthy();
        alu.add(0, 1);
        expect(cpu.statusWord.zero).toBeFalsy();
    });
    it('Sets signum flag', function () {
        alu.add(-1, 0);
        expect(cpu.statusWord.signum).toBeTruthy();
        alu.add(1, 0);
        expect(cpu.statusWord.signum).toBeFalsy();
    });
    it('Sets carry flag', function () {
        alu.add(Math.pow(2, 32) - 1, 1);
        expect(cpu.statusWord.carry).toBeTruthy();
        alu.add(Math.pow(2, 32) - 1, 0);
        expect(cpu.statusWord.carry).toBeFalsy();
    });
    it('Sets overflow flag', function () {
        alu.add(Math.pow(2, 31) - 1, 1);
        expect(cpu.statusWord.overflow).toBeTruthy();
        alu.add(Math.pow(2, 31) - 1, -Math.pow(2, 31));
        expect(cpu.statusWord.overflow).toBeFalsy();
    });
    it('Sets parity flag', function () {
        alu.add(10, 5);
        expect(cpu.statusWord.parity).toBeTruthy();
        alu.add(10, 4);
        expect(cpu.statusWord.parity).toBeFalsy();
    });
    it('Doesn\'t set flags after inc and dec', function () {
        var zero = cpu.statusWord.zero;
        alu.inc(-1);
        expect(cpu.statusWord.zero).toEqual(zero);
        alu.dec(1);
        expect(cpu.statusWord.zero).toEqual(zero);
    });
    it('Correctly handles addition', function () {
        expect(alu.add(0, 0)).toEqual(0);
        expect(alu.add(1, 1)).toEqual(2);
        expect(alu.add(1, -1)).toEqual(0);
        expect(alu.add(-1000, 1000)).toEqual(0);
        expect(alu.add(Math.pow(2, 31) - 1, 1)).toEqual(-Math.pow(2, 31));
        expect(alu.add(13678, 256897)).toEqual(270575);
        expect(alu.add(Math.pow(2, 33), 1000)).toEqual(1000);
        expect(alu.add(-8978654, 22235)).toEqual(-8956419);
    });
    it('Correctly handles subtraction', function () {
        expect(alu.sub(0, 0)).toEqual(0);
        expect(alu.sub(1, 1)).toEqual(0);
        expect(alu.sub(1, -1)).toEqual(2);
        expect(alu.sub(-1000, 1000)).toEqual(-2000);
        expect(alu.sub(Math.pow(2, 31) - 1, Math.pow(2, 31) - 1)).toEqual(0);
        expect(alu.sub(13678, 256897)).toEqual(-243219);
        expect(alu.sub(Math.pow(2, 33), 1000)).toEqual(-1000);
        expect(alu.sub(-8978654, 22235)).toEqual(-9000889);
    });
    it('Correctly handles signed division', function () {
        expect(function () {
            alu.idivide(1, 0);
        }).toThrowError(runtime_exception_1.RuntimeException);
        var joc = jasmine.objectContaining;
        expect(alu.idivide(1, 1)).toEqual(joc({
            value: 1,
            remainder: 0
        }));
        expect(alu.idivide(-50, 2)).toEqual(joc({
            value: -25,
            remainder: 0
        }));
        expect(alu.idivide(80, 3)).toEqual(joc({
            value: 26,
            remainder: 2
        }));
        expect(alu.idivide(Math.pow(2, 33), 4)).toEqual(joc({
            value: 0,
            remainder: 0
        }));
    });
    it('Correctly handles signed multiplication', function () {
        var joc = jasmine.objectContaining;
        expect(alu.imultiply(0, 0)).toEqual(joc({
            lowerHalf: 0,
            upperHalf: 0
        }));
        expect(alu.imultiply(5687684, 0)).toEqual(joc({
            lowerHalf: 0,
            upperHalf: 0
        }));
        expect(alu.imultiply(68731, 1)).toEqual(joc({
            lowerHalf: 68731,
            upperHalf: 0
        }));
        expect(alu.imultiply(8879876, -1)).toEqual(joc({
            lowerHalf: -8879876,
            upperHalf: 0
        }));
        expect(alu.imultiply(568765, 2287)).toEqual(joc({
            lowerHalf: 1300765555,
            upperHalf: 0
        }));
        expect(alu.imultiply(Math.pow(2, 30), 4)).toEqual(joc({
            lowerHalf: 0,
            upperHalf: 1
        }));
    });
});
//# sourceMappingURL=alu.spec.js.map