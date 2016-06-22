import {CPU} from "../cpu";
import {ReadUnaryOperation} from "./instruction";

export class Push extends ReadUnaryOperation
{
    execute(cpu: CPU): number
    {
        cpu.push(this.target.getValue());
        return cpu.eip + 1;
    }
}
