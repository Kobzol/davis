import {Instruction, UnaryReadOperation} from "./instruction";
import {CPU} from "../cpu";

export class Enter extends Instruction
{
    execute(cpu: CPU): number
    {
        cpu.push(cpu.getRegisterByName("EBP").getValue());
        cpu.getRegisterByName("EBP").setValue(cpu.getRegisterByName("ESP").getValue());

        return cpu.getNextInstruction();
    }
}

export class Leave extends Instruction
{
    execute(cpu: CPU): number
    {
        cpu.getRegisterByName("ESP").setValue(cpu.getRegisterByName("EBP").getValue());
        cpu.getRegisterByName("EBP").setValue(cpu.pop());
        return cpu.getNextInstruction();
    }
}

export class Call extends UnaryReadOperation
{
    execute(cpu: CPU): number
    {
        cpu.push(cpu.eip + 1);
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
