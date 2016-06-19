import {Component} from "@angular/core";

@Component({
    selector: "console",
    templateUrl: "app/components/console/console.html"
})
export class ConsoleComponent
{
    private value: string = "";

    public print(value: string)
    {
        this.value += value;
    }

    private clear()
    {
        this.value = "";
    }
}
