"use strict";
var assembler_1 = require("../app/assembly/assembler");
var cpu_1 = require("../app/emulation/cpu");
var memory_block_1 = require("../app/emulation/memory-block");
var process_1 = require("../app/emulation/process");
function runProgram(program) {
    var memory = new memory_block_1.MemoryBlock(256);
    var cpu = new cpu_1.CPU(program, memory);
    cpu.onError.subscribe(function (runtimeException) { throw runtimeException; });
    var process = new process_1.Process(cpu);
    process.start(true);
    return cpu;
}
describe('Davis', function () {
    var assembler;
    beforeEach(function () {
        assembler = new assembler_1.Assembler();
    });
    it('Respects size of arguments when writing to registers', function () {
        var program = assembler.assemble("\n            section .text\n                MOV EAX, 257\n                MOV AL, BYTE 2\n        ");
        var cpu = runProgram(program);
        expect(cpu.getRegisterByName("EAX").getValue()).toEqual(258);
    });
    it('Respects size of arguments when writing to memory', function () {
        var program = assembler.assemble("\n            section .text\n                MOV EAX, 0\n                MOV [EAX], 257\n                MOV [EAX], BYTE 2\n        ");
        var cpu = runProgram(program);
        expect(cpu.memory.load(0, 4).getValue()).toEqual(258);
    });
    it('Has LOOP instruction', function () {
        var program = assembler.assemble("\n            section .text\n                MOV ECX, 5\n                MOV EAX, 0\n            body:\n                ADD EAX, ECX\n                LOOP body\n        ");
        var cpu = runProgram(program);
        expect(cpu.getRegisterByName("EAX").getValue()).toEqual(15);
    });
    it('Correctly handles memory dereference from register', function () {
        var program = assembler.assemble("\n            section .text\n                MOV [17], 4\n                MOV EAX, 8\n                MOV ECX, 2\n                MOV [EAX + ECX * 4 + 1], 113\n        ");
        var cpu = runProgram(program);
        expect(cpu.memory.load(17, 4).getValue()).toEqual(113);
    });
    it('Correctly handles memory dereference from label', function () {
        var program = assembler.assemble("\n            section .data\n            padding:\n                db 1, 2, 3, 4\n            test:\n                db 1, 1\n            section .text\n                MOV [test], BYTE 2\n                MOV ECX, 2\n                MOV [padding + ECX * 1 - 1], BYTE 1\n        ");
        var cpu = runProgram(program);
        expect(cpu.memory.load(4, 2).getValue()).toEqual(258);
        expect(cpu.memory.load(0, 2).getValue()).toEqual(257);
    });
});
//# sourceMappingURL=instructions.spec.js.map