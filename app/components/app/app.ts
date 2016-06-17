import {Component, ViewChild} from '@angular/core';
import {MemoryBlock} from "./../../emulation/memory-block";
import {CPU} from "./../../emulation/cpu";
import {Assembler} from "./../../assembly/assembler";
import {Program} from "./../../assembly/program";
import {AsmEditor} from "../asm-editor/asm-editor";
import {CpuComponent} from "../cpu/cpu";
import {MemoryComponent} from "../memory/memory";
import {Runtime} from "../../emulation/runtime";
import {Process} from "../../emulation/process";
import {ExecutionComponent} from "../execution/execution";

@Component({
    selector: "app",
    templateUrl: "app/components/app/app.html",
    directives: [AsmEditor, CpuComponent, MemoryComponent, ExecutionComponent]
})
export class App
{
    @ViewChild(AsmEditor) asmEditor: AsmEditor;

    private runtime: Runtime = new Runtime();
    private assembler: Assembler = new Assembler();

    private memorySize: number = 256;
    private compileErrors: string = "";

    private compileSource(source: string)
    {
        try
        {
            let program: Program = this.assembler.assemble(source);
            let memory: MemoryBlock = new MemoryBlock(this.memorySize);
            let cpu: CPU = new CPU(program, memory);
            cpu.breakpoints = this.asmEditor.breakpoints;
            this.runtime.process = new Process(cpu);

            this.compileErrors = "";
        }
        catch (e)
        {
            this.compileErrors = `Error at line ${e.line}: ${e.message}`;
        }
    }

    private onBreakpointChanged(breakpoints: number[])
    {
        if (this.runtime.hasProcess())
        {
            this.runtime.process.cpu.breakpoints = breakpoints;
        }
    }

    private getActiveLine(): number
    {
        if (this.runtime.hasProcess() && this.runtime.process.isStarted())
        {
            return this.runtime.process.cpu.activeLine;
        }
        else return null;
    }

    /*private handleInterrupt(number: number)
    {
        switch (number)
        {
            case 1:
                this.print(this.cpu.getRegisterByName("EAX").getValue().toString());
                break;
            case 2:
            {
                let data: string = "";
                let start = this.cpu.getRegisterByName("EAX").getValue();
                while (true)
                {
                    let char = this.cpu.memory.load(start, 1).getValue();
                    if (char == 0) break;
                    data += String.fromCharCode(char);
                    start++;
                }
                this.print(data);
                break;
            }
        }
    }*/
}
