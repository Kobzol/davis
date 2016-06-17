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
    @Input() width: number = 16;

    private getRowCount(): number
    {
        let count: number = Math.floor(this.memory.size / this.width);
        let upperCount: number = Math.ceil(this.memory.size / this.width);

        return upperCount > count ? count + 1 : count;
    }
    private createRange(count: number): number[]
    {
        return _.range(count);
    }
    private createAddress(row: number, col: number): number
    {
        return row * this.width + col;
    }
}
