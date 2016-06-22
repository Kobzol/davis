import {Instruction, BinaryOperation} from "./instruction";
import {CPU} from "../cpu";
import {MemoryView} from "../memory-view";
import {Parameter} from "./parameter";

export class Move extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(this.source.getValue());
        return cpu.eip + 1;
    }

    loadParameters(target: MemoryView, source: MemoryView)
    {
        this.target = target;
        this.source = source;
    }
}
