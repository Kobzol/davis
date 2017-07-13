import {CPU} from "./cpu";

export class ConditionUnit
{
    constructor(private cpu: CPU)
    {

    }

    get overflow(): boolean
    {
        return this.cpu.statusWord.overflow;
    }
    get sign(): boolean
    {
        return this.cpu.statusWord.signum;
    }
    get parity(): boolean
    {
        return this.cpu.statusWord.parity;
    }

    get equal(): boolean
    {
        return this.cpu.statusWord.zero;
    }

    get below(): boolean
    {
        return this.cpu.statusWord.carry;
    }
    get above(): boolean
    {
        return !this.cpu.statusWord.carry && !this.cpu.statusWord.zero;
    }

    get less(): boolean
    {
        return this.cpu.statusWord.signum !== this.cpu.statusWord.overflow;
    }
    get greater(): boolean
    {
        return this.cpu.statusWord.zero && (this.cpu.statusWord.signum === this.cpu.statusWord.overflow);
    }
}
