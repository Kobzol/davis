import * as _ from "lodash";
import {UnaryOperation, Instruction} from "./instruction";
import {CPU} from "../cpu";
import {Parameter, ConstantParameter} from "./parameter";
import {MemoryView} from "../memory-view";
import {CONDITION_INDEX, ConditionInfo, Condition} from "./condition";

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
}

export class ConditionalJump extends Instruction
{
    private condition: MemoryView;
    private target: MemoryView;

    execute(cpu: CPU): number
    {
        let conditionClass: any = this.findCondition(this.condition.getValue());
        let jump: boolean = new conditionClass().shouldJump(cpu);
        return jump ? this.target.getValue() : (cpu.eip + 1);
    }

    private findCondition(code: number): any
    {
        return _.find(CONDITION_INDEX, (info: ConditionInfo) => info.code == code).cls;
    }

    loadParameters(condition: MemoryView, target: MemoryView)
    {
        this.condition = condition;
        this.target = target;
    }
}
