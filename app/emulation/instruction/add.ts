import {Instruction} from "./instruction";
import {MemoryView} from "../memory-view";
import {CPU} from "../cpu";
import {Parameter} from "./parameter";
import {RegisterParameter} from "./parameter";
import {BinaryOperation} from "./instruction";

export class Add extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.add(this.target.getValue(), this.source.getValue()));
        return cpu.eip + 1;
    }
}
abstract class AddWithCarry extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.alu.add(this.target.getValue(), this.source.getValue(), cpu.statusWord.carry ? 1 : 0));
        return cpu.eip + 1;
    }
}
