import {Instruction, UnaryOperation} from "./instruction";
import {CPU} from "../cpu";
import {MemoryView} from "../memory-view";
import {Parameter, RegisterParameter} from "./parameter";

export class Pop extends UnaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.pop());
        return cpu.eip + 1;
    }
}
