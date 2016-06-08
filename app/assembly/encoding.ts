import * as _ from "lodash";
import {Instruction} from "../emulation/instruction/instruction";
import {Parameter} from "../emulation/instruction/parameter";
import {CPU} from "../emulation/cpu";
import {MemoryView} from "../emulation/memory-view";

export class EncodedInstruction
{
    private instruction: Instruction;
    private parameters: Parameter[];

    constructor(instruction: Instruction, parameters: Parameter[])
    {
        this.instruction = instruction;
        this.parameters = parameters;
    }

    public instantiate(cpu: CPU): Instruction
    {
        let data: MemoryView[] = _.map(this.parameters, (parameter: Parameter) => parameter.fetchData(cpu));
        this.instruction.loadParameters.apply(this.instruction, data);

        return this.instruction;
    }
}
