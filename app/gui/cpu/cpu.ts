import {Component, Input} from "@angular/core";
import {CPU} from "../../emulation/cpu";

@Component({
    selector: "cpu-view",
    templateUrl: "app/gui/cpu/cpu.html"
})
export class CpuView
{
    @Input() public cpu: CPU;

    getRegisterKeys(): any[]
    {
        return Object.keys(this.cpu.registerMap);
    }
}