import {CPU} from "./cpu";
import {MemoryDefinition} from "../assembly/assembler";
import {MemoryBlock} from "./memory-block";

export class Process
{
    private started: boolean = false;

    constructor(private _cpu: CPU)
    {
        this.cpu.onExit.subscribe((cpu: CPU) => this.started = false);
    }

    get cpu(): CPU
    {
        return this._cpu;
    }

    public start(sync: boolean = false)
    {
        this.started = true;
        this.reset();
        this.initMemory();

        if (sync)
        {
            this.cpu.runSync();
        }
        else this.cpu.run();
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

    private initMemory()
    {
        let memoryDefinitions: MemoryDefinition[] = this.cpu.program.memoryDefinitions;
        let memory: MemoryBlock = this.cpu.memory;

        for (const memoryDef of memoryDefinitions)
        {
            memory.load(memoryDef.address, memoryDef.size).setValue(memoryDef.value);
        }
    }
}
