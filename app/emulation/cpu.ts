import * as _ from "lodash";
import {MemoryBlock} from "./memory-block";
import {MemoryView} from "./memory-view";
import {Instruction} from "./instruction/instruction";
import {EventBroadcaster} from "../util/event-broadcaster";
import {Interrupt} from "./instruction/interrupt";
import {Parameter} from "./instruction/parameter";
import {Pop} from "./instruction/pop";
import {ALU} from "./alu";
import {SetCarry, ClearCarry, SetDirection, ClearDirection} from "./instruction/flags";
import {Enter, Leave, CallAddress, Return} from "./instruction/retcall";
import {Jump, ConditionalJump} from "./instruction/jump";
import {Program} from "../assembly/program";
import {Dictionary} from "../util/interfaces";

export class RegisterInfo
{
    private _id: number;
    private _bank: number;
    private _byteSize: number;
    private _index: number;

    constructor(id: number, bank: number, byteSize: number, index: number = 0)
    {
        this._id = id;
        this._bank = bank;
        this._byteSize = byteSize;
        this._index = index;
    }

    get id(): number
    {
        return this._id;
    }
    get index(): number
    {
        return this._index;
    }
    get byteSize(): number
    {
        return this._byteSize;
    }
    get bank(): number
    {
        return this._bank;
    }
}

export class StatusWord
{
    private _carry: boolean = false;
    private _zero: boolean = false;
    private _overflow: boolean = false;
    private _signum: boolean = false;
    private _direction: boolean = false;

    get direction():boolean {
        return this._direction;
    }
    set direction(value:boolean) {
        this._direction = value;
    }

    get signum():boolean {
        return this._signum;
    }
    set signum(value:boolean) {
        this._signum = value;
    }

    get overflow():boolean {
        return this._overflow;
    }
    set overflow(value:boolean) {
        this._overflow = value;
    }

    get zero():boolean {
        return this._zero;
    }
    set zero(value:boolean) {
        this._zero = value;
    }

    get carry():boolean {
        return this._carry;
    }
    set carry(value:boolean) {
        this._carry = value;
    }

    toString(): string
    {
        return "[CF: " + this.carry + ", ZF: " + this.zero + ", OF: " + this.overflow
            + " SF: " + this.signum + ", DF: " + this.direction + "]";
    }
}

export const REGISTER_INDEX: any = {
    NULL    : new RegisterInfo(0, 0, 4),
    EIP     : new RegisterInfo(1, 1, 4),
    EBP     : new RegisterInfo(2, 2, 4),
    ESP     : new RegisterInfo(3, 3, 4),
    EAX     : new RegisterInfo(20, 4, 4),
    AX      : new RegisterInfo(21, 4, 2),
    AH      : new RegisterInfo(22, 4, 1, 1),
    AL      : new RegisterInfo(23, 4, 1),
    EBX     : new RegisterInfo(24, 5, 4),
    BX      : new RegisterInfo(25, 5, 2),
    BH      : new RegisterInfo(26, 5, 1, 1),
    BL      : new RegisterInfo(27, 5, 1),
    ECX     : new RegisterInfo(28, 6, 4),
    CX      : new RegisterInfo(29, 6, 2),
    CH      : new RegisterInfo(30, 6, 1, 1),
    CL      : new RegisterInfo(31, 6, 1)
};

export class CPU
{
    private status: StatusWord = new StatusWord();
    private registers: MemoryBlock[];
    private _registerMap: Dictionary<MemoryView> = {};
    private _alu: ALU;
    private _memory: MemoryBlock;
    private _program: Program;
    private _onInterrupt: EventBroadcaster = new EventBroadcaster();

    constructor(program: Program, memory: MemoryBlock)
    {
        this.registers = _.map(_.range(10), () => new MemoryBlock(4));
        this._program = program;
        this._memory = memory;
        this._alu = new ALU(this);

        _.keys(REGISTER_INDEX).forEach((key) =>
        {
            let reg: RegisterInfo = REGISTER_INDEX[key];
            this._registerMap[key] = new MemoryView(this.registers[reg.bank], reg.byteSize, reg.index);
        });
        this.reset();
    }

    reset()
    {
        this.getRegisterByName("EIP").setValue(0);
        this.getRegisterByName("ESP").setValue(this.memory.getSize() - 1);
        this.getRegisterByName("EBP").setValue(this.memory.getSize() - 1);
    }
    step()
    {
        let eip: number = this.eip;
        let instruction: Instruction = this.loadInstruction(eip);
        let nextAddress: number = instruction.execute(this);
        this.getRegisterByName("EIP").setValue(nextAddress);
    }

    push(value: number)
    {
        let esp: MemoryView = this.getRegisterByName("ESP");
        esp.add(-4);
        this.deref(esp).setValue(value);
    }
    pop(): number
    {
        let esp: MemoryView = this.getRegisterByName("ESP");
        let value: number = this.deref(esp).getValue();
        esp.add(4);

        return value;
    }
    deref(memoryView: MemoryView): MemoryView
    {
        return this.memory.load(memoryView.getValue(), memoryView.size);
    }
    calculateEffectiveAddress(baseReg: MemoryView, indexReg?: MemoryView,
                              multiplier: number = 1, constant: number = 0): number
    {
        if (indexReg === undefined) indexReg = this.getRegisterByName("NULL");
        return baseReg.getValue() + indexReg.getValue() * multiplier + constant;
    }
    setFlags(value: number)
    {
        this.status.zero = value == 0;
        this.status.signum = value < 0;
    }

    getRegisterByName(name: string): MemoryView
    {
        return this.registerMap[name];
    }
    getRegisterByIndex(index: number): MemoryView
    {
        return this.getRegisterByName(_.findKey(REGISTER_INDEX, (reg: RegisterInfo) => reg.id == index));
    }

    get eip(): number { return this.registerMap["EIP"].getValue(); }
    get statusWord(): StatusWord { return this.status; }
    get memory(): MemoryBlock { return this._memory; }
    get program(): Program { return this._program; }
    get onInterrupt(): EventBroadcaster { return this._onInterrupt; }
    get alu(): ALU { return this._alu; }
    get registerMap(): Dictionary<MemoryView> { return this._registerMap; }

    private loadInstruction(eip: number): Instruction
    {
        return this.program.getInstructionByAddress(this, eip);
    }
}
