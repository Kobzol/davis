import {Component, Input} from "@angular/core";
import {CPU} from "../../emulation/cpu";

@Component({
    selector: "register",
    templateUrl: "./register.html"
})
export class RegisterComponent
{
    @Input() cpu: CPU = null;
    @Input() name: string = "";

    private getValue(): number
    {
        return this.cpu.getRegisterByName(this.name).getValue();
    }
}
