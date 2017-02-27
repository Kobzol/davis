import {Assembler} from "../app/assembly/assembler";
import {Program} from "../app/assembly/program";
import {CPU} from "../app/emulation/cpu";
import {MemoryBlock} from "../app/emulation/memory-block";
import {Process} from "../app/emulation/process";
import {RuntimeException} from "../app/emulation/runtime-exception";

function runProgram(program: Program): CPU
{
    let memory: MemoryBlock = new MemoryBlock(256);
    let cpu: CPU = new CPU(program, memory);
    cpu.onError.subscribe((runtimeException: RuntimeException) => { throw runtimeException; });
    let process = new Process(cpu);
    process.start(true);

    return cpu;
}

describe('Davis', () =>
{
    let assembler: Assembler;

    beforeEach(() => {
        assembler = new Assembler();
    });

    it('Respects size of arguments when writing to registers', () => {
        const program: Program = assembler.assemble(`
            section .text
                MOV EAX, 257
                MOV AL, BYTE 2
        `);
        let cpu: CPU = runProgram(program);
        expect(cpu.getRegisterByName("EAX").getValue()).toEqual(258);
    });
    it('Respects size of arguments when writing to memory', () => {
        const program: Program = assembler.assemble(`
            section .text
                MOV EAX, 0
                MOV [EAX], 257
                MOV [EAX], BYTE 2
        `);
        let cpu: CPU = runProgram(program);
        expect(cpu.memory.load(0, 4).getValue()).toEqual(258);
    });

    it('Has LOOP instruction', () => {
        const program = assembler.assemble(`
            section .text
                MOV ECX, 5
                MOV EAX, 0
            body:
                ADD EAX, ECX
                LOOP body
        `);
        let cpu = runProgram(program);

        expect(cpu.getRegisterByName("EAX").getValue()).toEqual(15);
    });

    it('Correctly handles memory dereference', () => {
       const program = assembler.assemble(`
            section .text
                MOV [17], 4
                MOV EAX, 8
                MOV ECX, 2
                MOV [EAX + ECX * 4 + 1], 113
        `);
       let cpu = runProgram(program);
       expect(cpu.memory.load(17, 4).getValue()).toEqual(113);
    });
});
