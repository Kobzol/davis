import {CPU} from "../cpu";
import {BinaryOperation} from "./instruction";

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

export class DivideSigned extends BinaryOperation
{
    public execute(cpu: CPU): number
    {
        let edx = cpu.getRegisterByName("EDX").getValue();
        let eax = cpu.getRegisterByName("EAX").getValue();

        let value: number = cpu.alu.extend64bit(eax, edx);
        let result: { value: number, remainder: number } = cpu.alu.idivide(value, this.source.getValue());

        cpu.getRegisterByName("EDX").setValue(result.remainder);
        cpu.getRegisterByName("EAX").setValue(result.value);

        return cpu.eip + 1;
    }
}
export class MultiplySigned extends BinaryOperation
{
    public execute(cpu: CPU): number
    {
        let eax = cpu.getRegisterByName("EAX").getValue();
        let result: { lowerHalf: number, upperHalf: number } = cpu.alu.imultiply(eax, this.source.getValue());

        cpu.getRegisterByName("EDX").setValue(result.upperHalf);
        cpu.getRegisterByName("EAX").setValue(result.lowerHalf);

        return cpu.eip + 1;
    }
}
