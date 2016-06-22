import {CPU} from "../cpu";
import {MemoryView} from "../memory-view";

export abstract class Instruction
{
    abstract execute(cpu: CPU): number;
    getValidParameters(): string[][] { return []; }
    loadParameters(...args: any[]): void { }

    toString(): string
    {
        return this.constructor.toString();
    }
}

export abstract class UnaryOperation extends Instruction
{
    protected target: MemoryView;

    loadParameters(target: MemoryView)
    {
        this.target = target;
    }
}

export abstract class BinaryOperation extends Instruction
{
    protected target: MemoryView;
    protected source: MemoryView;

    loadParameters(target: MemoryView, source: MemoryView)
    {
        this.target = target;
        this.source = source;
    }
}
