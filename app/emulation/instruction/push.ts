import {CPU} from "../cpu";
import {UnaryReadOperation} from "./instruction";

export class Push extends UnaryReadOperation
{
    execute(cpu: CPU): number
    {
        cpu.push(this.target.getValue());
        return cpu.eip + 1;
    }
}
