import {UnaryWriteOperation} from "./instruction";
import {CPU} from "../cpu";

export class Pop extends UnaryWriteOperation
{
    execute(cpu: CPU): number
    {
        this.target.setValue(cpu.pop());
        return cpu.getNextInstruction();
    }
}
