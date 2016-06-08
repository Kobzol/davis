import {Component} from '@angular/core';
import {MemoryView} from "./../../emulation/memory-view";
import {MemoryBlock} from "./../../emulation/memory-block";
import {CPU, REGISTER_INDEX} from "./../../emulation/cpu";
import {CONDITION_INDEX} from "./../../emulation/instruction/condition";
import {Assembler} from "./../../assembly/assembler";
import {Program} from "./../../assembly/program";
import {AsmEditor} from "../asm-editor/asm-editor";
import {Logger} from "angular2-logger/core";
import {CpuView} from "../cpu/cpu";

@Component({
    selector: 'my-app',
    templateUrl: "app/gui/app/app.html",
    directives: [AsmEditor, CpuView]
})
export class App
{
    private cpu: CPU;
    private program: Program;
    private memory: MemoryBlock;
    private assembler: Assembler;

    constructor(private _logger: Logger)
    {
        this.assembler = new Assembler();
        this.memory = new MemoryBlock(30);

        this.program = this.assembler.assemble("MOV EAX, 1");
        this.cpu = new CPU(this.program, this.memory);
        this.cpu.onInterrupt.subscribe((number: number) => { this.handleInterrupt(number); });
    }

    private dumpMemory()
    {
        let data: number[] = [];
        for (let i = 0; i < this.memory.getSize(); i++)
        {
            let byte: MemoryView = new MemoryView(this.memory, 1, i);
            data.push(byte.getValue());
        }

        console.log(data);
    }

    private handleInterrupt(number: number)
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
    }

    private print(data: string)
    {
        console.log(data);
    }
}
