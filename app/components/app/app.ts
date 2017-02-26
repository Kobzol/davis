import {Component, ViewChild, AfterViewInit} from "@angular/core";
import {MemoryBlock} from "../../emulation/memory-block";
import {CPU, Interrupt} from "../../emulation/cpu";
import {Assembler, AssemblyException} from "../../assembly/assembler";
import {Program} from "../../assembly/program";
import {AsmEditorComponent} from "../asm-editor/asm-editor";
import {CpuComponent} from "../cpu/cpu";
import {MemoryComponent} from "../memory/memory";
import {Runtime} from "../../emulation/runtime";
import {Process} from "../../emulation/process";
import {ExecutionComponent} from "../execution/execution";
import {ConsoleComponent} from "../console/console";
import {RuntimeException} from "../../emulation/runtime-exception";

@Component({
    selector: "app",
    templateUrl: "app/components/app/app.html",
    directives: [AsmEditorComponent, CpuComponent, MemoryComponent, ExecutionComponent, ConsoleComponent]
})
export class AppComponent implements AfterViewInit
{
    @ViewChild(AsmEditorComponent) asmEditor: AsmEditorComponent;
    @ViewChild(ConsoleComponent) console: ConsoleComponent;

    private runtime: Runtime = new Runtime();
    private assembler: Assembler = new Assembler();
    private cpu: CPU;

    private memorySize: number = 256;
    private compileErrors: string = "";

    ngAfterViewInit()
    {
        this.asmEditor.text =
`section .data
hello:
    db 'Hello world!', 10, 0

section .text

asd:
    MOV EAX, hello
    MOV [EAX], BYTE 97 ; MOV EAX, hello
    INT 2
    HLT`
        ;
    }

    private compileSource(source: string)
    {
        try
        {
            let program: Program = this.assembler.assemble(source);
            let memory: MemoryBlock = new MemoryBlock(this.memorySize);
            this.cpu = new CPU(program, memory);
            this.cpu.onInterrupt.subscribe((interrupt: Interrupt) => this.handleInterrupt(interrupt));
            this.cpu.onError.subscribe((runtimeException: RuntimeException) => alert(runtimeException.message));
            this.cpu.breakpoints = this.asmEditor.breakpoints;
            this.runtime.process = new Process(this.cpu);

            this.compileErrors = "";
        }
        catch (e)
        {
            if (e instanceof AssemblyException)
            {
                this.compileErrors = `Error at line ${e.line}: ${e.message}`;
            }
            else
            {
                throw e;
            }
        }
    }

    private handleInterrupt(interrupt: Interrupt)
    {
        try
        {
            switch (interrupt)
            {
                case Interrupt.WRITE_NUM:
                    this.print(this.cpu.getRegisterByName("EAX").getValue().toString());
                    break;
                case Interrupt.WRITE_STRING:
                {
                    let data: string = "";
                    let start: number = this.cpu.getRegisterByName("EAX").getValue();
                    while (true)
                    {
                        let char = this.cpu.derefAddress(start, 1).getValue();
                        if (char === 0)
                        {
                            break;
                        }
                        data += String.fromCharCode(char);
                        start++;
                    }
                    this.print(data);
                    break;
                }
                default:
                {
                    throw new RuntimeException("Unknown interrupt code: " + interrupt);
                }
            }
        }
        catch (e)
        {
            this.cpu.pause();
            alert(e.message);
        }
    }

    private print(value: string)
    {
        this.console.print(value);
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
        else
        {
            return null;
        }
    }
}
