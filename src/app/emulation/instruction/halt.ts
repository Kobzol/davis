import {Instruction} from "./instruction";
import {CPU} from "../cpu";

export class Halt extends Instruction
{
    execute(cpu: CPU): number
    {
        cpu.halt();
        return cpu.eip;
    }
}
