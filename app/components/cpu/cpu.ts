import {Component, Input} from "@angular/core";
import {CPU} from "../../emulation/cpu";

@Component({
    selector: "cpu",
    templateUrl: "app/components/cpu/cpu.html"
})
export class CpuComponent
{
    @Input() cpu: CPU = null;

    getRegisterKeys(): any[]
    {
        return Object.keys(this.cpu.registerMap);
    }
}
