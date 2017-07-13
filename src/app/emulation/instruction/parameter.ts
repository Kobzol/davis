import {MemoryView} from "../memory-view";
import {NumericConstant} from "../memory-view";
import {CPU, REGISTER_INDEX} from "../cpu";

export interface Indexer
{
    indexReg: number;
    multiplier: number;
    constant: number;
}

export abstract class Parameter
{
    public static get Reg() { return "Reg"; }
    public static get Memory() { return "Mem"; }
    public static get Constant() { return "Constant"; }
    public static get DerefConstant() { return "DerefConstant"; }

    constructor(protected size: number = 4)
    {

    }

    abstract fetchData(cpu: CPU): MemoryView;
}

export class RegisterParameter extends Parameter
{
    constructor(size: number, private registerIndex: number)
    {
        super(size);
    }

    fetchData(cpu: CPU): MemoryView
    {
        return cpu.getRegisterByIndex(this.registerIndex);
    }
}

export class MemoryParameter extends Parameter
{
    constructor(size: number,
                private baseReg: number,
                private indexer: Indexer)
    {
        super(size);
    }

    fetchData(cpu: CPU): MemoryView
    {
        let baseReg: MemoryView = cpu.getRegisterByIndex(this.baseReg);
        let indexReg: MemoryView = cpu.getRegisterByIndex(this.indexer.indexReg);

        return cpu.derefAddress(cpu.calculateEffectiveAddressFromRegister(baseReg, indexReg, this.indexer.multiplier, this.indexer.constant), this.size);
    }
}

export class LabelParameter extends Parameter
{
    protected value: number = -1;

    constructor(size: number,
                private _label: string = "")
    {
        super(size);
    }

    get label(): string
    {
        return this._label;
    }
    set label(value: string)
    {
        this._label = value;
    }

    resolveLabel(value: number)
    {
        this.value = value;
    }

    fetchData(cpu: CPU): MemoryView
    {
        return new NumericConstant(this.value, this.size);
    }
}

export class DerefLabelParameter extends LabelParameter
{
    constructor(size: number,
                label: string = "",
                private indexer: Indexer)
    {
        super(size, label);
    }

    fetchData(cpu: CPU): MemoryView
    {
        let indexReg: MemoryView = cpu.getRegisterByIndex(this.indexer.indexReg);
        return cpu.derefAddress(cpu.calculateEffectiveAddress(this.value, indexReg, this.indexer.multiplier, this.indexer.constant), this.size);
    }
}
