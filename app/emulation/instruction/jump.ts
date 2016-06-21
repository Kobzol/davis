import {UnaryOperation} from "./instruction";
import {CPU} from "../cpu";
import {Parameter} from "./parameter";

export class Jump extends UnaryOperation
{
    execute(cpu: CPU): number
    {
        return this.target.getValue();
    }

    getValidParameters(): string[][]
    {
        return [
            [Parameter.Label],
            [Parameter.Constant],
            [Parameter.Memory]
        ];
    }

    protected jumpIf(cpu: CPU, condition: boolean): number
    {
        return condition ? this.target.getValue() : cpu.eip + 1;
    }
}

export class JumpO extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.conditionUnit.overflow);
    }
}
export class JumpNO extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, !cpu.conditionUnit.overflow);
    }
}

export class JumpS extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.conditionUnit.sign);
    }
}
export class JumpNS extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, !cpu.conditionUnit.sign);
    }
}

export class JumpE extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.conditionUnit.equal);
    }
}
export class JumpNE extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, !cpu.conditionUnit.equal);
    }
}

export class JumpB extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.conditionUnit.below);
    }
}
export class JumpAE extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, !cpu.conditionUnit.below);
    }
}

export class JumpA extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.conditionUnit.above);
    }
}
export class JumpBE extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, !cpu.conditionUnit.above);
    }
}

export class JumpL extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.conditionUnit.less);
    }
}
export class JumpGE extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, !cpu.conditionUnit.less);
    }
}

export class JumpLE extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, !cpu.conditionUnit.greater);
    }
}
export class JumpG extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.conditionUnit.greater);
    }
}

export class JumpP extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.conditionUnit.parity);
    }
}
export class JumpNP extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, !cpu.conditionUnit.parity);
    }
}

export class JumpCXZ extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.getRegisterByName("CX").getValue() === 0);
    }
}
export class JumpECXZ extends Jump
{
    execute(cpu: CPU): number
    {
        return this.jumpIf(cpu, cpu.getRegisterByName("ECX").getValue() === 0);
    }
}
