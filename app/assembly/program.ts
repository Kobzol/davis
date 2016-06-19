import * as _ from "lodash";
import {Instruction} from "../emulation/instruction/instruction";
import {CPU} from "../emulation/cpu";
import {EncodedInstruction} from "./encoding";
import {MemoryDefinition} from "./assembler";

export class LineMap
{
    private mapping: any = {};

    public mapLine(address: number, line: number)
    {
        this.mapping[address] = line;
    }
    public getLineByAddress(address: number): number
    {
        return _.findLast(this.mapping, (line: number, key: number) => key <= address);
    }
    public getAddressByLine(row: number) : number
    {
        return Number(_.findKey(this.mapping, (line: number) => line == row));
    }
}

export class Program
{
    constructor(private _instructions: EncodedInstruction[],
                private _memoryDefinitions: MemoryDefinition[],
                private _lineMap: LineMap)
    {

    }

    get instructions(): EncodedInstruction[]
    {
        return this._instructions;
    }
    get memoryDefinitions(): MemoryDefinition[]
    {
        return this._memoryDefinitions;
    }
    public get lineMap(): LineMap
    {
        return this._lineMap;
    }

    public getInstructionByAddress(cpu: CPU, address: number): Instruction
    {
        return this.instructions[address].instantiate(cpu);
    }
}
