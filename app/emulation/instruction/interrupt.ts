import {Instruction} from "./instruction";
import {CPU} from "../cpu";
import {Parameter} from "./parameter";
import {ConstantParameter} from "./parameter";
import {MemoryView} from "../memory-view";

export class Interrupt extends Instruction
{
    private number: MemoryView;

    execute(cpu: CPU): number
    {
        cpu.onInterrupt.emit(this.number.getValue());
        return cpu.eip + 1;
    }

    loadParameters(number: MemoryView): void
    {
        this.number = number;
    }

    getValidParameters(): string[][]
    {
        return [
            [Parameter.Constant],
            [Parameter.Reg]
        ]
    }
}
