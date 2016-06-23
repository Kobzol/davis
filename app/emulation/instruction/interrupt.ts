import {ReadUnaryOperation} from "./instruction";
import {CPU} from "../cpu";
import {MemoryView} from "../memory-view";

export class Interrupt extends ReadUnaryOperation
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
}
