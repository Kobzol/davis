import {WriteUnaryOperation} from "./instruction";
import {CPU} from "../cpu";

export class Pop extends WriteUnaryOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.pop());
        return cpu.eip + 1;
    }
}
