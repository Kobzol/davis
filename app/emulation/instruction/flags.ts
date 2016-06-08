import {Instruction} from "./instruction";
import {CPU} from "../cpu";

export class SetDirection extends Instruction
{
    execute(cpu: CPU): number
    {
        cpu.statusWord.direction = true;
        return cpu.eip + 1;
    }
}
export class ClearDirection extends Instruction
{
    execute(cpu: CPU): number
    {
        cpu.statusWord.direction = false;
        return cpu.eip + 1;
    }
}

export class SetCarry extends Instruction
{
    execute(cpu: CPU): number
    {
        cpu.statusWord.carry = true;
        return cpu.eip + 1;
    }
}
export class ClearCarry extends Instruction
{
    execute(cpu: CPU): number
    {
        cpu.statusWord.carry = false;
        return cpu.eip + 1;
    }
}
