"use strict";
var ConditionUnit = (function () {
    function ConditionUnit(cpu) {
        this.cpu = cpu;
    }
    Object.defineProperty(ConditionUnit.prototype, "overflow", {
        get: function () {
            return this.cpu.statusWord.overflow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionUnit.prototype, "sign", {
        get: function () {
            return this.cpu.statusWord.signum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionUnit.prototype, "parity", {
        get: function () {
            return this.cpu.statusWord.parity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionUnit.prototype, "equal", {
        get: function () {
            return this.cpu.statusWord.zero;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionUnit.prototype, "below", {
        get: function () {
            return this.cpu.statusWord.carry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionUnit.prototype, "above", {
        get: function () {
            return !this.cpu.statusWord.carry && !this.cpu.statusWord.zero;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionUnit.prototype, "less", {
        get: function () {
            return this.cpu.statusWord.signum !== this.cpu.statusWord.overflow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionUnit.prototype, "greater", {
        get: function () {
            return this.cpu.statusWord.zero && (this.cpu.statusWord.signum === this.cpu.statusWord.overflow);
        },
        enumerable: true,
        configurable: true
    });
    return ConditionUnit;
}());
exports.ConditionUnit = ConditionUnit;
//# sourceMappingURL=condition-unit.js.map