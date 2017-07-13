"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var parameter_1 = require("./parameter");
var Compare = (function (_super) {
    __extends(Compare, _super);
    function Compare() {
        _super.apply(this, arguments);
    }
    Compare.prototype.execute = function (cpu) {
        cpu.alu.sub(this.target.getValue(), this.source.getValue());
        return cpu.getNextInstruction();
    };
    Compare.prototype.getValidParameters = function () {
        return [
            [parameter_1.Parameter.Reg, parameter_1.Parameter.Reg],
            [parameter_1.Parameter.Reg, parameter_1.Parameter.Memory],
            [parameter_1.Parameter.Memory, parameter_1.Parameter.Reg]
        ];
    };
    return Compare;
}(instruction_1.BinaryOperation));
exports.Compare = Compare;
//# sourceMappingURL=cmp.js.map