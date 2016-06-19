import {Instruction} from "./instruction";
import {CPU} from "../cpu";
import {MemoryView} from "../memory-view";
import {Parameter} from "./parameter";

export class Move extends Instruction
{
    private target: MemoryView;
    private source: MemoryView;

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

    getValidParameters(): string[][]
    {
        return [
            [Parameter.Reg, Parameter.Reg],
            [Parameter.Reg, Parameter.Constant],
            [Parameter.Reg, Parameter.Memory],
            [Parameter.Memory, Parameter.Reg],
            [Parameter.Memory, Parameter.Constant],
            [Parameter.Reg, Parameter.Label]
        ];
    }
}
