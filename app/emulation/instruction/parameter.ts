import {MemoryView} from "../memory-view";
import {NumericConstant} from "../memory-view";
import {CPU, REGISTER_INDEX} from "../cpu";

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
                private indexReg: number = REGISTER_INDEX.NULL.id,
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

export class LabelParameter extends Parameter
{
    protected value: number = -1;

    constructor(size: number,
                private _label: string = "")
    {
        super(size);
    }

    get label() { return this._label; }

    resolveLabel(value: number)
    {
        this.value = value;
    }

    fetchData(cpu: CPU): MemoryView
    {
        return new NumericConstant(this.value);
    }
}

export class DerefLabelParameter extends LabelParameter
{
    constructor(size: number,
                label: string = "")
    {
        super(size, label);
    }

    fetchData(cpu: CPU): MemoryView
    {
        return cpu.deref(new NumericConstant(this.value), this.size);
    }
}
