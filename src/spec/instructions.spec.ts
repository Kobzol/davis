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

    it('Correctly handles memory dereference from register', () => {
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
    it('Correctly handles memory dereference from label', () => {
        const program = assembler.assemble(`
            section .data
            padding:
                db 1, 2, 3, 4
            test:
                db 1, 1
            section .text
                MOV [test], BYTE 2
                MOV ECX, 2
                MOV [padding + ECX * 1 - 1], BYTE 1
        `);
        let cpu = runProgram(program);
        expect(cpu.memory.load(4, 2).getValue()).toEqual(258);
        expect(cpu.memory.load(0, 2).getValue()).toEqual(257);
    });

  it('Correctly handles JA 1', () => {
    const program = assembler.assemble(`
            section .text
                MOV EBX, 0
                MOV EAX, 2
                CMP EAX, 1
                JA end
                MOV EBX, 42
            end:
                HLT
        `);
    let cpu = runProgram(program);
    expect(cpu.getRegisterByName("EBX").getValue()).toEqual(0);
  });

  it('Correctly handles JA 2', () => {
    const program = assembler.assemble(`
            section .text
                MOV EBX, 0
                MOV EAX, 1
                CMP EAX, 2
                JA end
                MOV EBX, 42
            end:
                HLT
        `);
    let cpu = runProgram(program);
    expect(cpu.getRegisterByName("EBX").getValue()).toEqual(42);
  });

  it('Correctly handles JA 3', () => {
    const program = assembler.assemble(`
            section .text
                MOV EBX, 0
                MOV EAX, 2
                CMP EAX, 2
                JA end
                MOV EBX, 42
            end:
                HLT
        `);
    let cpu = runProgram(program);
    expect(cpu.getRegisterByName("EBX").getValue()).toEqual(42);
  });

  it('Correctly handles JG 1', () => {
    const program = assembler.assemble(`
            section .text
                MOV EBX, 0
                MOV EAX, 2
                CMP EAX, 1
                JG end
                MOV EBX, 42
            end:
                HLT
        `);
    let cpu = runProgram(program);
    expect(cpu.getRegisterByName("EBX").getValue()).toEqual(0);
  });

  it('Correctly handles JG 2', () => {
    const program = assembler.assemble(`
            section .text
                MOV EBX, 0
                MOV EAX, 1
                CMP EAX, 2
                JG end
                MOV EBX, 42
            end:
                HLT
        `);
    let cpu = runProgram(program);
    expect(cpu.getRegisterByName("EBX").getValue()).toEqual(42);
  });

  it('Correctly handles JG 3', () => {
    const program = assembler.assemble(`
            section .text
                MOV EBX, 0
                MOV EAX, 2
                CMP EAX, 2
                JG end
                MOV EBX, 42
            end:
                HLT
        `);
    let cpu = runProgram(program);
    expect(cpu.getRegisterByName("EBX").getValue()).toEqual(42);
  });
});
