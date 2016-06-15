import {MemoryBlock} from "./memory-block";

var GET_METHODS = {
    "1": ["getUint8", "getInt8"],
    "2": ["getUint16", "getInt16"],
    "4": ["getUint32", "getInt32"]
};
var SET_METHODS = {
    "1": ["setUint8", "setInt8"],
    "2": ["setUint16", "setInt16"],
    "4": ["setUint32", "setInt32"]
};

export class MemoryView
{
    private memory: MemoryBlock;
    private view: DataView;
    private byteSize: number;
    private index: number;
    private signed: boolean;
    private getMethod: string;
    private setMethod: string;

    constructor(memory: MemoryBlock, byteSize: number, index: number = 0, signed: boolean = false)
    {
        this.memory = memory;
        this.byteSize = byteSize;
        this.index = index;
        this.signed = signed;

        this.view = new DataView(this.memory.data, index);
        let signedIndex: number = signed ? 1 : 0;
        this.getMethod = GET_METHODS[byteSize.toString()][signedIndex];
        this.setMethod = SET_METHODS[byteSize.toString()][signedIndex];
    }

    setValue(value: number)
    {
        this.view[this.setMethod](0, value, true);
    }
    getValue(): number
    {
        return this.view[this.getMethod](0, true);
    }
    add(value: number)
    {
        this.setValue(this.getValue() + value);
    }

    getOffsetView(offset: number, byteSize?: number, signed: boolean = false)
    {
        if (byteSize === undefined) byteSize = this.byteSize;

        return new MemoryView(this.memory, byteSize, this.index + offset, signed);
    }

    get size(): number { return this.byteSize; }
}

export class NumericConstant extends MemoryView
{
    constructor(value: number, byteSize: number = 4, signed: boolean = false)
    {
        super(new MemoryBlock(byteSize), byteSize, 0, signed);
        super.setValue(value);
    }

    setValue(value: number)
    {
        throw new Error("Numeric constant's value cannot be changed");
    }
}
