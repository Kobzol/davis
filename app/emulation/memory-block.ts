import {MemoryView} from "./memory-view";

export class MemoryBlock
{
    private data: ArrayBuffer;

    constructor(size: number)
    {
        this.data = new ArrayBuffer(size);
    }

    load(address: number, size: number = 4, signed: boolean = false): MemoryView
    {
        return new MemoryView(this, size, address, signed);
    }

    getData(): ArrayBuffer { return this.data; }
    getSize(): number { return this.getData().byteLength; }
}
