import {Assembler, AssemblyException, MemoryDefinition} from "../app/assembly/assembler";
import {Program} from "../app/assembly/program";

describe('Assembler', () =>
{
    let assembler: Assembler;

    beforeEach(() => {
       assembler = new Assembler();
    });

    it('Requires data section for data definitions', () => {
        expect(() => {
            assembler.assemble(`db 1, 2`);
        }).toThrowError(AssemblyException);
    });
    it('Requires data definitions to be first', () => {
        expect(() => {
            assembler.assemble(`
                section .text
                db 1, 2
            `);
        }).toThrowError(AssemblyException);
    });

    it('Doesn\'t allow text in data section', () => {
        expect(() => {
            assembler.assemble(`
                section .data
                MOV EAX, 5
            `);
        }).toThrowError(AssemblyException);
    });
    it('Doesn\'t allow data in text section', () => {
        expect(() => {
            assembler.assemble(`
                section .data
                section .text
                db 1, 2
            `);
        }).toThrowError(AssemblyException);
    });

    it('Rejects non-existent instructions', () => {
        expect(() => {
            assembler.assemble(`
                section .text
                DOES_NOT_EXIST
            `);
        }).toThrowError(AssemblyException);
    });

    it('Doesn\'t have side effects', () => {
        let source: string = `
            section .text
                MOV EAX, 5
        `;

        let program : Program = assembler.assemble(source);
        let secondProgram: Program = assembler.assemble(source);

        expect(JSON.stringify(program.lineMap)).toEqual(JSON.stringify(secondProgram.lineMap));
        expect(JSON.stringify(program.instructions)).toEqual(JSON.stringify(secondProgram.instructions));
        expect(JSON.stringify(program.memoryDefinitions)).toEqual(JSON.stringify(secondProgram.memoryDefinitions));
    });

    it('Correctly handles data definitions', () => {
        let program: Program = assembler.assemble(`
            section .data
            db 1, 2, 3
            dd 5, 100000, 'ahoj'
            db 'ahoj', 0, 'hello'
            dw 10
        `);

        let memoryDefinitions: MemoryDefinition[] = program.memoryDefinitions;

        expect(memoryDefinitions.length).toEqual(20, "Length of definitions should be 20");

        expect(memoryDefinitions[0].address).toEqual(0);
        expect(memoryDefinitions[0].size).toEqual(1);
        expect(memoryDefinitions[0].value).toEqual(1);

        expect(memoryDefinitions[2].address).toEqual(2);
        expect(memoryDefinitions[2].size).toEqual(1);
        expect(memoryDefinitions[2].value).toEqual(3);

        expect(memoryDefinitions[4].address).toEqual(7);
        expect(memoryDefinitions[4].size).toEqual(4);
        expect(memoryDefinitions[4].value).toEqual(100000);

        expect(memoryDefinitions[19].address).toEqual(37);
        expect(memoryDefinitions[19].size).toEqual(2);
        expect(memoryDefinitions[19].value).toEqual(10);
    });

    it('Recognizes existing labels', () => {
        expect(() => {
            assembler.assemble(`
            section .data
            data1: db 1, 2, 3
            section .text
            data2:
                MOV EAX, data1
                MOV EBX, data2
        `);
        }).not.toThrow();
    });
    it('Doesn\'t recognize non-existing labels', () => {
        expect(() => {
            assembler.assemble(`
            section .data
            data1: db 1, 2, 3
            section .text
            data2:
                MOV EAX, nonExistingLabel
        `);
        }).toThrowError(AssemblyException);
    });
    it('Recognizes local labels', () => {
        expect(() => {
            assembler.assemble(`
            section .text
            test:
                MOV EAX, .localTest
            .localTest:
                LEAVE
        `);
        }).not.toThrow();
    });
    it('Rejects local label without global label', () => {
        expect(() => {
            assembler.assemble(`
            section .text
            .data2:
                MOV EAX, .data2
        `);
        }).toThrowError(AssemblyException);
    });

    it('Rejects wrong combination of operand sizes', () => {
        expect(() => {
            assembler.assemble(`
            section .text
            MOV EAX, BYTE 5
        `);
        }).toThrowError(AssemblyException);
    });
});
