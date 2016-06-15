import {Process} from "./process";

export class Runtime
{
    private _process: Process = null;

    get process(): Process
    {
        return this._process;
    }
    set process(process: Process)
    {
        this._process = process;
    }

    public hasProcess(): boolean
    {
        return this.process !== null;
    }
}
