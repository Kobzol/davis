import {Instruction, ReadUnaryOperation} from "./instruction";
import {CPU} from "../cpu";

export class Enter extends Instruction
{
    execute(cpu: CPU): number
    {
        cpu.push(cpu.getRegisterByName("EBP").getValue());
        cpu.getRegisterByName("EBP").setValue(cpu.getRegisterByName("ESP").getValue());

        return cpu.eip + 1;
    }
}

export class Leave extends Instruction
{
    execute(cpu: CPU): number
    {
        cpu.getRegisterByName("EBP").setValue(cpu.pop());
        return cpu.eip + 1;
    }
}

export class Call extends ReadUnaryOperation
{
    execute(cpu: CPU): number
    {
        cpu.push(cpu.eip);
        return this.target.getValue();
    }
}

export class Return extends Instruction
{
    execute(cpu: CPU): number
    {
        return cpu.pop();
    }
}
