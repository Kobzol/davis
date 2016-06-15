import * as _ from "lodash";
import {MemoryBlock} from "../emulation/memory-block";
import {ClearCarry} from "../emulation/instruction/flags";
import {SetCarry} from "../emulation/instruction/flags";
import {SetDirection} from "../emulation/instruction/flags";
import {ClearDirection} from "../emulation/instruction/flags";
import {LineMap} from "./program";
import {Program} from "./program";
import {EncodedInstruction} from "./encoding";
import {Parameter} from "../emulation/instruction/parameter";
import {Move} from "../emulation/instruction/mov";
import {Instruction} from "../emulation/instruction/instruction";
import {RegisterParameter} from "../emulation/instruction/parameter";
import {ConstantParameter} from "../emulation/instruction/parameter";
import {REGISTER_INDEX} from "../emulation/cpu";
import {MemoryParameter} from "../emulation/instruction/parameter";
import {Jump} from "../emulation/instruction/jump";
import {LabelParameter} from "../emulation/instruction/parameter";
import {Interrupt} from "../emulation/instruction/interrupt";
var parser = require("./asm-parser.js");

class Label
{
    constructor(public name: string, public local: boolean, public address: number)
    {

    }
}

class LabelResolver
{
    private labels: any = {};
    private unresolvedParameters: LabelParameter[] = [];

    addLabel(address: number, label: string, local: boolean = false)
    {
        label = this.normalizeLabelName(label, local, address);

        if (this.hasLabel(label))
        {
            throw new AssemblyException("Duplicate label found: " + label);
        }

        this.labels[label] = new Label(label, local, address);
    }
    private normalizeLabelName(label: string, local: boolean, address: number): string
    {
        if (local)
        {
            let previousLabel: Label = this.findPreviousGlobalLabel(address);

            if (previousLabel === undefined)
            {
                throw new AssemblyException("Local label without a global label: " + label);
            }

            return previousLabel.name + "." + label;
        }

        return label;
    }
    private hasLabel(label: string): boolean
    {
        return _.has(this.labels, label);
    }
    private findPreviousGlobalLabel(address: number): Label
    {
        return _.findLast(this.labels, (label: Label) => !label.local && label.address <= address);
    }

    markUnresolvedParameter(labelParameter: LabelParameter)
    {
        this.unresolvedParameters.push(labelParameter);
    }
    resolveAddresses()
    {
        _.each(this.unresolvedParameters, (labelParameter: LabelParameter) => {
            if (!_.has(this.labels, labelParameter.label))
            {
                throw new AssemblyException("Unknown label " + labelParameter.label);
            }

            labelParameter.resolveLabel(this.labels[labelParameter.label].address);
        });
    }
}

export class AssemblyException
{
    constructor(public message: string = "",
                public line: number = 0,
                public data: any = {})
    {

    }
}

const InstructionMapping = {
    "MOV": Move,
    "JMP": Jump,
    "INT": Interrupt
};

export class Assembler
{
    private address: number = 0;
    private labelResolver: LabelResolver = new LabelResolver();

    assemble(program: string) : Program
    {
        let lines: any[] = [];

        try
        {
            lines = parser.parse(program);
        }
        catch (e)
        {
            throw new AssemblyException(e.message, e.location.start.line);
        }

        let lineMap: LineMap = new LineMap();
        let instructions: EncodedInstruction[] = [];

        for (let i = 0; i < lines.length; i++)
        {
            lineMap.mapLine(this.address, i);
            try
            {
                if (lines[i].tag == "Line")
                {
                    let instruction: EncodedInstruction = this.assembleInstruction(lines[i]);
                    if (instruction !== null)
                    {
                        instructions.push(instruction);
                    }
                }
            }
            catch (e)
            {
                if (e instanceof AssemblyException)
                {
                    throw new AssemblyException(e.message, i + 1, lines[i]);
                }
                else throw e;
            }
        }

        this.labelResolver.resolveAddresses();

        return new Program(instructions, lineMap);
    }

    private assembleInstruction(line: {tag: string, label: any, instruction: any}): EncodedInstruction
    {
        if (line.label !== null)
        {
            this.assembleLabel(line.label);
        }

        if (line.instruction !== null)
        {
            return this.parseInstruction(line.instruction);
        }
        else return null;
    }
    private parseInstruction(instruction: {tag: string, type: string, name: string, operands: any[]}): EncodedInstruction
    {
        if (!_.has(InstructionMapping, instruction.name))
        {
            throw new AssemblyException("Unknown instruction type " + instruction.type);
        }

        let instructionInstance: Instruction = new InstructionMapping[instruction.name];
        return new EncodedInstruction(instructionInstance, this.loadParameters(instructionInstance, instruction.operands));
    }

    private loadParameters(instruction: Instruction, operands: any[]): Parameter[]
    {
        this.checkParameterCompatibility(instruction, operands);

        let mapping = {};
        mapping[Parameter.Reg] = this.parseRegisterParameter;
        mapping[Parameter.Constant] = this.parseConstantParameter;
        mapping[Parameter.Memory] = this.parseMemoryParameter;
        mapping[Parameter.Label] = this.parseLabelParameter;

        return _.map(operands, (operand) => {
            let innerOperand: any = this.getInnerParameter(operand);
            return mapping[innerOperand.tag].call(this, this.getParameterSize(operand), innerOperand);
        });
    }
    private parseRegisterParameter(size: number, operand: any): Parameter
    {
        return new RegisterParameter(size, REGISTER_INDEX[this.parseRegisterName(operand)].id);
    }
    private parseConstantParameter(size: number, operand: any): Parameter
    {
        return new ConstantParameter(size, operand.value, _.has(operand, "deref"));
    }
    private parseMemoryParameter(size: number, operand: any): Parameter
    {
        let baseRegId: number = REGISTER_INDEX[this.parseRegisterName(operand.baseRegister)].id;

        let indexRegId: number = 0;
        if (operand.indexRegister !== null)
        {
            indexRegId = REGISTER_INDEX[this.parseRegisterName(operand.indexRegister)].id;
        }

        let multiplier: number = operand.multiplier !== null ? operand.multiplier.value : 0;
        let constant: number = operand.constant !== null ? operand.constant.value : 0;

        return new MemoryParameter(size, baseRegId, indexRegId, multiplier, constant);
    }
    private parseLabelParameter(size: number, operand: any): Parameter
    {
        let labelParameter: LabelParameter = new LabelParameter(size, operand.value, _.has(operand, "deref"));
        this.labelResolver.markUnresolvedParameter(labelParameter);

        return labelParameter;
    }

    private parseRegisterName(operand: any): string
    {
        let registerName: string = operand.name;
        if (!_.has(REGISTER_INDEX, registerName)) throw new AssemblyException("Unknown register " + registerName);

        return registerName;
    }
    private checkParameterCompatibility(instruction: Instruction, operands: any[])
    {
        let parameterMask = _.map(operands, (operand) => this.getInnerParameter(operand).tag);
        let validMasks: string[][] = instruction.getValidParameters();

        for (let i = 0; i < validMasks.length; i++)
        {
            if (_.isEqual(parameterMask, validMasks[i]))
            {
                return;
            }
        }

        throw new AssemblyException("Unknown parameter combination for instruction " + instruction.toString());
    }
    private getInnerParameter(operand: any): any
    {
        if (operand.tag === "Cast") return this.getInnerParameter(operand.value);
        else return operand;
    }
    private getParameterSize(operand: any): number
    {
        if (operand.tag === "Cast") return operand.size > 0 ? operand.size : 4;
        else return 4;
    }

    private assembleLabel(label: {tag: string, name: any, local: boolean})
    {
       this.labelResolver.addLabel(this.address, label.name.value, label.local);
    }
}
