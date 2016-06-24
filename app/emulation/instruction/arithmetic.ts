import {CPU} from "../cpu";
import {BinaryOperation, UnaryReadOperation, UnaryWriteOperation} from "./instruction";
import {RuntimeException} from "../runtime-exception";

export class Add extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.add(this.target.getValue(), this.source.getValue()));
        return cpu.eip + 1;
    }
}
export class AddWithCarry extends Add
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.add(this.target.getValue(), this.source.getValue(), cpu.statusWord.carry ? 1 : 0));
        return cpu.eip + 1;
    }
}

export class Sub extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.sub(this.target.getValue(), this.source.getValue()));
        return cpu.eip + 1;
    }
}
export class SubWithBorrow extends Sub
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.sub(this.target.getValue(), this.source.getValue(), cpu.statusWord.carry ? 1 : 0));
        return cpu.eip + 1;
    }
}

export class Increment extends UnaryWriteOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.inc(this.target.getValue()));
        return cpu.eip + 1;
    }
}
export class Decrement extends UnaryWriteOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.dec(this.target.getValue()));
        return cpu.eip + 1;
    }
}

export class DivideSigned extends UnaryReadOperation
{
    public execute(cpu: CPU): number
    {
        if (this.target.getValue() === 0)
        {
            throw new RuntimeException("Division by zero");
        }

        let edx = cpu.getRegisterByName("EDX").getValue();
        let eax = cpu.getRegisterByName("EAX").getValue();

        let value: number = cpu.alu.extend64bit(eax, edx);
        let result: { value: number, remainder: number } = cpu.alu.idivide(value, this.target.getValue());

        cpu.getRegisterByName("EDX").setValue(result.remainder);
        cpu.getRegisterByName("EAX").setValue(result.value);

        return cpu.eip + 1;
    }
}
export class MultiplySigned extends UnaryReadOperation
{
    public execute(cpu: CPU): number
    {
        let eax = cpu.getRegisterByName("EAX").getValue();
        let result: { lowerHalf: number, upperHalf: number } = cpu.alu.imultiply(eax, this.target.getValue());

        cpu.getRegisterByName("EDX").setValue(result.upperHalf);
        cpu.getRegisterByName("EAX").setValue(result.lowerHalf);

        return cpu.eip + 1;
    }
}
