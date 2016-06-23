import {CPU} from "../app/emulation/cpu";
import {ALU} from "../app/emulation/alu";
import {MemoryBlock} from "../app/emulation/memory-block";

describe("ALU", () => {
    let cpu: CPU;
    let alu: ALU;

    beforeEach(() => {
        cpu = new CPU(null, new MemoryBlock(256));
        alu = cpu.alu;
    });

    it('Sets zero flag', () => {
        alu.add(0, 0);
        expect(cpu.statusWord.zero).toBeTruthy();

        alu.add(0, 1);
        expect(cpu.statusWord.zero).toBeFalsy();
    });
    it('Sets signum flag', () => {
        alu.add(-1, 0);
        expect(cpu.statusWord.signum).toBeTruthy();

        alu.add(1, 0);
        expect(cpu.statusWord.signum).toBeFalsy();
    });
    it('Sets carry flag', () => {
        alu.add(Math.pow(2, 32) - 1, 1);
        expect(cpu.statusWord.carry).toBeTruthy();

        alu.add(Math.pow(2, 32) - 1, 0);
        expect(cpu.statusWord.carry).toBeFalsy();
    });
    it('Sets overflow flag', () => {
        alu.add(Math.pow(2, 31) - 1, 1);
        expect(cpu.statusWord.overflow).toBeTruthy();

        alu.add(Math.pow(2, 31) - 1, -Math.pow(2, 31));
        expect(cpu.statusWord.overflow).toBeFalsy();
    });
    it('Sets parity flag', () => {
        alu.add(10, 5);
        expect(cpu.statusWord.parity).toBeTruthy();

        alu.add(10, 4);
        expect(cpu.statusWord.parity).toBeFalsy();
    });
    it('Doesn\'t set flags after inc and dec', () => {
        let zero: boolean = cpu.statusWord.zero;

        alu.inc(-1);
        expect(cpu.statusWord.zero).toEqual(zero);

        alu.dec(1);
        expect(cpu.statusWord.zero).toEqual(zero);
    });

    it('Correctly handles addition', () => {
        expect(alu.add(0, 0)).toEqual(0);
        expect(alu.add(1, 1)).toEqual(2);
        expect(alu.add(1, -1)).toEqual(0);
        expect(alu.add(-1000, 1000)).toEqual(0);
        expect(alu.add(Math.pow(2, 31) - 1, 1)).toEqual(-Math.pow(2, 31));
        expect(alu.add(13678, 256897)).toEqual(270575);
        expect(alu.add(Math.pow(2, 33), 1000)).toEqual(1000);
        expect(alu.add(-8978654, 22235)).toEqual(-8956419);
    });
    it('Correctly handles subtraction', () => {
        expect(alu.sub(0, 0)).toEqual(0);
        expect(alu.sub(1, 1)).toEqual(0);
        expect(alu.sub(1, -1)).toEqual(2);
        expect(alu.sub(-1000, 1000)).toEqual(-2000);
        expect(alu.sub(Math.pow(2, 31) - 1, Math.pow(2, 31) - 1)).toEqual(0);
        expect(alu.sub(13678, 256897)).toEqual(-243219);
        expect(alu.sub(Math.pow(2, 33), 1000)).toEqual(-1000);
        expect(alu.sub(-8978654, 22235)).toEqual(-9000889);
    });
});
