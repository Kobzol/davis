import {MemoryView} from "../memory-view";
import {NumericConstant} from "../memory-view";
import {CPU} from "../cpu";

export abstract class Parameter
{
    public static get Reg() { return "Reg"; }
    public static get Constant() { return "Number"; }
    public static get Memory() { return "Mem"; }
    public static get Label() { return "Label"; }

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
                private indexReg: number = 0,
                private multiplier: number = 1,
                private constant: number = 0)
    {
        super(size);
    }

    fetchData(cpu: CPU): MemoryView
    {
        let baseReg: MemoryView = cpu.getRegisterByIndex(this.baseReg);
        let indexReg: MemoryView = cpu.getRegisterByIndex(this.indexReg);

        return cpu.memory.load(cpu.calculateEffectiveAddress(baseReg, indexReg, this.multiplier, this.constant));
    }
}

export class ConstantParameter extends Parameter
{
    constructor(size: number,
                protected value: number,
                private deref: boolean)
    {
        super(size);
    }

    fetchData(cpu: CPU): MemoryView
    {
        let value: MemoryView = new NumericConstant(this.value);

        if (this.deref)
        {
            return cpu.deref(value, this.size);
        }
        else return value;
    }
}

export class LabelParameter extends Parameter
{
    private address: number = -1;
    private _label: string;
    private _deref: boolean;

    constructor(size: number, label: string, deref: boolean = false)
    {
        super(size);

        this._label = label;
        this._deref = deref;
    }

    get label() { return this._label; }
    get deref() { return this._deref; }

    resolveLabel(address: number)
    {
        this.address = address;
    }

    fetchData(cpu: CPU): MemoryView
    {
        let value: MemoryView = new NumericConstant(this.address);

        if (this.deref)
        {
            return cpu.deref(value, this.size);
        }
        else return value;
    }
}
