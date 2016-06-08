import * as _ from "lodash";
import {CPU} from "../cpu";
import {Parameter} from "./parameter";
import {MemoryView} from "../memory-view";

export abstract class Instruction
{
    abstract execute(cpu: CPU): number;
    getValidParameters(): string[][] { return []; }
    loadParameters(...args: any[]): void { }
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
