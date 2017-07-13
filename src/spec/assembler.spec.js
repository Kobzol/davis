"use strict";
var assembler_1 = require("../app/assembly/assembler");
describe('Assembler', function () {
    var assembler;
    beforeEach(function () {
        assembler = new assembler_1.Assembler();
    });
    it('Requires data section for data definitions', function () {
        expect(function () {
            assembler.assemble("db 1, 2");
        }).toThrowError(assembler_1.AssemblyException);
    });
    it('Requires data definitions to be first', function () {
        expect(function () {
            assembler.assemble("\n                section .text\n                db 1, 2\n            ");
        }).toThrowError(assembler_1.AssemblyException);
    });
    it('Doesn\'t allow text in data section', function () {
        expect(function () {
            assembler.assemble("\n                section .data\n                MOV EAX, 5\n            ");
        }).toThrowError(assembler_1.AssemblyException);
    });
    it('Doesn\'t allow data in text section', function () {
        expect(function () {
            assembler.assemble("\n                section .data\n                section .text\n                db 1, 2\n            ");
        }).toThrowError(assembler_1.AssemblyException);
    });
    it('Rejects non-existent instructions', function () {
        expect(function () {
            assembler.assemble("\n                section .text\n                DOES_NOT_EXIST\n            ");
        }).toThrowError(assembler_1.AssemblyException);
    });
    it('Doesn\'t have side effects', function () {
        var source = "\n            section .text\n                MOV EAX, 5\n        ";
        var program = assembler.assemble(source);
        var secondProgram = assembler.assemble(source);
        expect(JSON.stringify(program.lineMap)).toEqual(JSON.stringify(secondProgram.lineMap));
        expect(JSON.stringify(program.instructions)).toEqual(JSON.stringify(secondProgram.instructions));
        expect(JSON.stringify(program.memoryDefinitions)).toEqual(JSON.stringify(secondProgram.memoryDefinitions));
    });
    it('Correctly handles data definitions', function () {
        var program = assembler.assemble("\n            section .data\n            db 1, 2, 3\n            dd 5, 100000, 'ahoj'\n            db 'ahoj', 0, 'hello'\n            dw 10\n        ");
        var memoryDefinitions = program.memoryDefinitions;
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
    it('Recognizes existing labels', function () {
        expect(function () {
            assembler.assemble("\n            section .data\n            data1: db 1, 2, 3\n            section .text\n            data2:\n                MOV EAX, data1\n                MOV EBX, data2\n        ");
        }).not.toThrow();
    });
    it('Doesn\'t recognize non-existing labels', function () {
        expect(function () {
            assembler.assemble("\n            section .data\n            data1: db 1, 2, 3\n            section .text\n            data2:\n                MOV EAX, nonExistingLabel\n        ");
        }).toThrowError(assembler_1.AssemblyException);
    });
    it('Recognizes local labels', function () {
        expect(function () {
            assembler.assemble("\n            section .text\n            test:\n                MOV EAX, .localTest\n            .localTest:\n                LEAVE\n        ");
        }).not.toThrow();
    });
    it('Rejects local label without global label', function () {
        expect(function () {
            assembler.assemble("\n            section .text\n            .data2:\n                MOV EAX, .data2\n        ");
        }).toThrowError(assembler_1.AssemblyException);
    });
    it('Rejects wrong combination of operand sizes', function () {
        expect(function () {
            assembler.assemble("\n            section .text\n            MOV EAX, BYTE 5\n        ");
        }).toThrowError(assembler_1.AssemblyException);
    });
});
//# sourceMappingURL=assembler.spec.js.map