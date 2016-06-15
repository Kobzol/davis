import {CPU} from "./cpu";

export class Process
{
    private started: boolean = false;

    constructor(private _cpu: CPU)
    {
        this.cpu.onInterrupt.subscribe((id: number) =>
        {
           if (id === CPU.INTERRUPT_EXIT)
           {
               this.started = false;
           }
        });
    }

    get cpu(): CPU
    {
        return this._cpu;
    }

    public start()
    {
        this.started = true;
        this.reset();
        this.cpu.run();
    }

    public isStarted(): boolean
    {
        return this.started;
    }
    public isRunning(): boolean
    {
        return this.isStarted() && this.cpu.running;
    }
    public isPaused(): boolean
    {
        return this.isStarted() && !this.cpu.running;
    }

    public reset()
    {
        this.cpu.reset();
        this.cpu.memory.clear();
    }
}
