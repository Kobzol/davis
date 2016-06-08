import {Instruction} from "./instruction";
import {CPU} from "../cpu";
import {MemoryView} from "../memory-view";
import {Parameter} from "./parameter";
import {RegisterParameter} from "./parameter";
import {ConstantParameter} from "./parameter";
import {UnaryOperation} from "./instruction";

export class Push extends UnaryOperation
{
    execute(cpu: CPU): number
    {
        cpu.push(this.target.getValue());
        return cpu.eip + 1;
    }
}
