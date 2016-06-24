import {BinaryOperation} from "./instruction";
import {CPU} from "../cpu";

export class And extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.and(this.target.getValue(), this.source.getValue()));
        return cpu.getNextInstruction();
    }
}
export class Or extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.or(this.target.getValue(), this.source.getValue()));
        return cpu.getNextInstruction();
    }
}
export class Xor extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.xor(this.target.getValue(), this.source.getValue()));
        return cpu.getNextInstruction();
    }
}
