import {Component, Input} from "@angular/core";
import {MemoryBlock} from "../../emulation/memory-block";

@Component({
    selector: "memory",
    templateUrl: "app/components/memory/memory.html"
})
export class MemoryComponent
{
    @Input() memory: MemoryBlock;
}
