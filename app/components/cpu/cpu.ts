import {Component, Input} from "@angular/core";
import {CPU} from "../../emulation/cpu";
import {RegisterComponent} from "./register";

@Component({
    selector: "cpu",
    templateUrl: "app/components/cpu/cpu.html",
    directives: [RegisterComponent]
})
export class CpuComponent
{
    @Input() cpu: CPU = null;

    private getRegisterKeys(): string[]
    {
        return ["EIP", "EAX", "EBX", "ECX", "EDX", "EBP", "ESP", "ESI", "EDI"];
    }
    private getFlags(): { name: string, value: boolean }[]
    {
        return [
            { name: "ZF", value: this.cpu.statusWord.zero },
            { name: "SF", value: this.cpu.statusWord.signum },
            { name: "OF", value: this.cpu.statusWord.overflow },
            { name: "CF", value: this.cpu.statusWord.carry },
            { name: "DF", value: this.cpu.statusWord.direction },
            { name: "PF", value: this.cpu.statusWord.parity }
        ];
    }
}
