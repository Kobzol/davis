import {BinaryOperation} from "./instruction";
import {CPU} from "../cpu";
import {MemoryView} from "../memory-view";

export class Move extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(this.source.getValue());
        return cpu.getNextInstruction();
    }

    loadParameters(target: MemoryView, source: MemoryView)
    {
        this.target = target;
        this.source = source;
    }
}
