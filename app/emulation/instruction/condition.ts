import {CPU} from "../cpu";

export class ConditionInfo
{
    private _code: number;
    private _cls: any;

    constructor(code: number, cls: any)
    {
        this._code = code;
        this._cls = cls;
    }

    get cls(): any
    {
        return this._cls;
    }
    get code(): number
    {
        return this._code;
    }
}

export abstract class Condition
{
    abstract shouldJump(cpu: CPU): boolean;
}

class ConditionEqual extends Condition
{
    shouldJump(cpu: CPU): boolean
    {
        return cpu.statusWord.zero;
    }
}

export var CONDITION_INDEX: any =
{
    EQUAL:  new ConditionInfo(1, ConditionEqual)
};
