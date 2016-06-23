import * as _ from "lodash";
import {MemoryBlock} from "./memory-block";
import {MemoryView, NumericConstant} from "./memory-view";
import {Instruction} from "./instruction/instruction";
import {ALU} from "./alu";
import {Program} from "../assembly/program";
import {Dictionary} from "../util/interfaces";
import {EventEmitter} from "@angular/core";
import {RuntimeException} from "./runtime-exception";
import {ConditionUnit} from "./condition-unit";
import {StatusWord} from "./status-word";

class RegisterInfo
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

export enum Interrupt
{
    WRITE_NUM = 1,
    WRITE_STRING = 2
}

export const REGISTER_INDEX: any = {
    NULL    : new RegisterInfo(0, 0, 4),
    EIP     : new RegisterInfo(1, 1, 4),
    EBP     : new RegisterInfo(2, 2, 4),
    ESP     : new RegisterInfo(3, 3, 4),
    ESI     : new RegisterInfo(4, 4, 4),
    SI      : new RegisterInfo(5, 4, 2),
    EDI     : new RegisterInfo(6, 5, 4),
    DI      : new RegisterInfo(7, 5, 2),
    EAX     : new RegisterInfo(20, 6, 4),
    AX      : new RegisterInfo(21, 6, 2),
    AH      : new RegisterInfo(22, 6, 1, 1),
    AL      : new RegisterInfo(23, 6, 1),
    EBX     : new RegisterInfo(24, 7, 4),
    BX      : new RegisterInfo(25, 7, 2),
    BH      : new RegisterInfo(26, 7, 1, 1),
    BL      : new RegisterInfo(27, 7, 1),
    ECX     : new RegisterInfo(28, 8, 4),
    CX      : new RegisterInfo(29, 8, 2),
    CH      : new RegisterInfo(30, 8, 1, 1),
    CL      : new RegisterInfo(31, 8, 1),
    EDX     : new RegisterInfo(32, 9, 4),
    DX      : new RegisterInfo(33, 9, 2),
    DH      : new RegisterInfo(34, 9, 1, 1),
    DL      : new RegisterInfo(35, 9, 1)

};

export class CPU
{
    public static INTERRUPT_EXIT: number = 0;

    private status: StatusWord = new StatusWord();
    private registers: MemoryBlock[];
    private _registerMap: Dictionary<MemoryView> = {};
    private _alu: ALU;
    private _conditionUnit: ConditionUnit;
    private _onInterrupt: EventEmitter<Interrupt> = new EventEmitter<Interrupt>();
    private _onExit: EventEmitter<CPU> = new EventEmitter<CPU>();
    private _onError: EventEmitter<RuntimeException> = new EventEmitter<RuntimeException>();
    private _running: boolean = false;
    private _breakpoints: number[];
    private stoppedOnBreakpoint: boolean = false;
    private scheduleTimeout: any = null;

    constructor(private _program: Program,
                private _memory: MemoryBlock,
                private _tick: number = 500)
    {
        this.registers = _.map(_.range(10), () => new MemoryBlock(4));
        this._alu = new ALU(this);
        this._conditionUnit = new ConditionUnit(this);

        _.keys(REGISTER_INDEX).forEach((key) =>
        {
            let reg: RegisterInfo = REGISTER_INDEX[key];
            this._registerMap[key] = new MemoryView(this.registers[reg.bank], reg.byteSize, reg.index);
        });
        this.reset();
    }

    get eip(): number
    {
        return this.registerMap["EIP"].getValue();
    }
    get statusWord(): StatusWord
    {
        return this.status;
    }
    get memory(): MemoryBlock
    {
        return this._memory;
    }
    get program(): Program
    {
        return this._program;
    }
    get onInterrupt(): EventEmitter<Interrupt>
    {
        return this._onInterrupt;
    }
    get onExit(): EventEmitter<CPU>
    {
        return this._onExit;
    }
    get onError(): EventEmitter<RuntimeException>
    {
        return this._onError;
    }
    get alu(): ALU
    {
        return this._alu;
    }
    get conditionUnit(): ConditionUnit
    {
        return this._conditionUnit;
    }
    get registerMap(): Dictionary<MemoryView>
    {
        return this._registerMap;
    }
    get running(): boolean
    {
        return this._running;
    }
    get activeLine(): number
    {
        return this.program.lineMap.getLineByAddress(this.eip);
    }
    set breakpoints(value: number[])
    {
        this._breakpoints = _.filter(
            _.map(value, (row: number) => this.program.lineMap.getAddressByLine(row),
            (breakpoint: number) => breakpoint !== null)
        );
    }

    reset()
    {
        this.getRegisterByName("EIP").setValue(0);
        this.getRegisterByName("ESP").setValue(this.memory.size - 1);
        this.getRegisterByName("EBP").setValue(this.memory.size - 1);
    }
    step()
    {
        if (this.isFinished())
        {
            this.pause();
            this.onExit.emit(this);
            return;
        }

        if (this.hasBreakpoint())
        {
            if (!this.stoppedOnBreakpoint)
            {
                this.stoppedOnBreakpoint = true;
                this.pause();
                return;
            }
            else
            {
                this.stoppedOnBreakpoint = false;
            }
        }

        this.executeOneInstruction();
    }
    run()
    {
        this._running = true;
        this.scheduleRun();
    }
    pause()
    {
        this._running = false;
        this.clearScheduledRun();
    }
    isFinished(): boolean
    {
        return this.eip >= this.program.instructions.length;
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
    deref_address(address: number, size: number = 4): MemoryView
    {
        return this.deref(new NumericConstant(address), size);
    }
    deref(memoryView: MemoryView, size: number = 4): MemoryView
    {
        let address: number = memoryView.getValue();

        if (!this.memory.isValid(address))
        {
            throw new RuntimeException("Invalid dereference of address " + address + " at line " + this.getLine());
        }
        if (address + size > this.memory.size)
        {
            throw new RuntimeException("Memory overflow at line " + this.getLine());
        }

        return this.memory.load(address, size);
    }
    calculateEffectiveAddress(baseReg: MemoryView, indexReg?: MemoryView,
                              multiplier: number = 1, constant: number = 0): number
    {
        if (indexReg === undefined)
        {
            indexReg = this.getRegisterByName("NULL");
        }

        return baseReg.getValue() + indexReg.getValue() * multiplier + constant;
    }
    setFlags(value: number)
    {
        this.status.zero = value === 0;
        this.status.signum = (value & (1 << 31)) !== 0;

        let parity: number = 0;
        for (let i = 0; i < 8; i++)
        {
            parity += ((value & (1 << i)) !== 0) ? 1 : 0;
        }
        this.status.parity = parity % 2 === 0;
    }

    getRegisterByName(name: string): MemoryView
    {
        return this.registerMap[name];
    }
    getRegisterByIndex(index: number): MemoryView
    {
        return this.getRegisterByName(_.findKey(REGISTER_INDEX, (reg: RegisterInfo) => reg.id === index));
    }

    private hasBreakpoint(): boolean
    {
        return _.includes(this._breakpoints, this.eip);
    }
    private executeOneInstruction()
    {
        let eip: number = this.eip;

        try
        {
            let instruction: Instruction = this.loadInstruction(eip);
            let nextAddress: number = instruction.execute(this);
            this.getRegisterByName("EIP").setValue(nextAddress);
        }
        catch (e)
        {
            this.onError.emit(e);
            this.pause();
        }
    }
    private loadInstruction(eip: number): Instruction
    {
        return this.program.getInstructionByAddress(this, eip);
    }

    private getLine(): number
    {
        return this.program.lineMap.getLineByAddress(this.eip) + 1;
    }

    private scheduleRun()
    {
        this.clearScheduledRun();
        this.scheduleTimeout = setTimeout(() => this.tickStep(), this._tick);
    }
    private clearScheduledRun()
    {
        if (this.scheduleTimeout !== null)
        {
            clearTimeout(this.scheduleTimeout);
        }
    }
    private tickStep()
    {
        if (this.running)
        {
            this.step();
            this.scheduleRun();
        }
    }
}
