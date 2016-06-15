import {Component, Input, EventEmitter, Output} from "@angular/core";
import {Process} from "../../emulation/process";

@Component({
    selector: "execution-controls",
    templateUrl: "app/components/execution/execution.html"
})
export class ExecutionComponent
{
    @Input() process: Process = null;

    @Output() start: EventEmitter<Process> = new EventEmitter<Process>();
    @Output() continueEvent: EventEmitter<Process> = new EventEmitter<Process>();
    @Output() pause: EventEmitter<Process> = new EventEmitter<Process>();
    @Output() step: EventEmitter<Process> = new EventEmitter<Process>();

    private onStart()
    {
        this.start.emit(this.process);
        this.process.start();
    }
    private onContinue()
    {
        this.continueEvent.emit(this.process);
        this.process.cpu.run();
    }
    private onPause()
    {
        this.pause.emit(this.process);
        this.process.cpu.pause();
    }
    private onStep()
    {
        this.step.emit(this.process);
        this.process.cpu.step();
    }
}
