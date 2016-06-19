import {Component, Input} from "@angular/core";
import {MemoryBlock} from "../../emulation/memory-block";
import * as _ from "lodash";

@Component({
    selector: "memory",
    templateUrl: "app/components/memory/memory.html"
})
export class MemoryComponent
{
    @Input() memory: MemoryBlock = null;
    @Input() wordSize: number = 1;
    @Input() width: number = 16;

    private getRowCount(): number
    {
        return Math.ceil(this.memory.size / this.width / this.wordSize);
    }
    private createRange(count: number): number[]
    {
        return _.range(count);
    }
    private createAddress(row: number, col: number): number
    {
        return row * this.width * this.wordSize + col * this.wordSize;
    }
}
