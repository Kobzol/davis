import {BinaryOperation} from "./instruction";
import {CPU} from "../cpu";
import {Parameter} from "./parameter";

export class Compare extends BinaryOperation
{
    execute(cpu: CPU): number
    {
        cpu.alu.sub(this.target.getValue(), this.source.getValue());
        return cpu.eip + 1;
    }

    getValidParameters(): string[][]
    {
        return [
            [Parameter.Reg, Parameter.Reg],
            [Parameter.Reg, Parameter.Memory],
            [Parameter.Memory, Parameter.Reg]
        ];
    }
}
