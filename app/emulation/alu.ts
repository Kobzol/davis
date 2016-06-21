import {CPU} from "./cpu";

export class ALU
{
    constructor(private cpu: CPU)
    {

    }

    add(op1: number, op2: number, previousCarry: number = 0): number
    {
        op1 = this.normalize(op1);
        op2 = this.normalize(op2);

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

        this.cpu.statusWord.carry = carry[1] === 1;
        this.cpu.statusWord.overflow = (carry[0] ^ carry[1]) === 1;
        this.cpu.setFlags(result);

        return this.normalize(result);
    }
    sub(op1: number, op2: number, previousCarry: number = 0): number
    {
        return this.add(op1, this.normalize(-op2), previousCarry);
    }
    
    inc(value: number): number
    {
        value = this.normalize(value);
        return this.normalize(value + 1);
    }
    dec(value: number): number
    {
        value = this.normalize(value);
        return this.normalize(value - 1);
    }

    private normalize(value: number): number
    {
        return value | 0;
    }
}
