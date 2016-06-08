import {CPU} from "./cpu";

export class ALU
{
    private cpu: CPU;

    constructor(cpu: CPU)
    {
        this.cpu = cpu;
    }

    add(op1: number, op2: number, previousCarry: number = 0): number
    {
        let result: number = 0;
        let carry: number[] = [previousCarry, 0];

        for (let i = 0; i < 32; i++)
        {
            carry[0] = carry[1];
            let value: number = (op1 & 1) + (op2 & 1) + carry[0];
            op1 >>= 1;
            op2 >>= 1;

            result |= (value % 2) << i;
            carry[1] = value / 2;
        }

        this.cpu.statusWord.carry = carry[1] == 1;
        this.cpu.statusWord.overflow = (carry[0] ^ carry[1]) == 1;
        this.cpu.setFlags(result);

        return result;
    }
    sub(op1: number, op2: number, previousCarry: number = 0): number
    {
        return this.add(op1, -op2, previousCarry);
    }
    inc(value: number): number
    {
        return value + 1;
    }
    dec(value: number): number
    {
        return value - 1;
    }
}
