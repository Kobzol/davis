import {BinaryOperation} from "./instruction";
import {CPU} from "../cpu";
import {Parameter} from "./parameter";
import {RegisterParameter} from "./parameter";

export class Compare extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        cpu.alu.sub(this.target.getValue(), this.source.getValue());
        return cpu.eip + 1;
    }
}
