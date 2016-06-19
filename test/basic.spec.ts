import {Assembler} from "../app/assembly/assembler";

describe('Assembler', () =>
{
    it('Recognizes MOV', () => {
        let assembler = new Assembler();
        assembler.assemble(`
            MOV EAX, 5
        `);
    });
});
