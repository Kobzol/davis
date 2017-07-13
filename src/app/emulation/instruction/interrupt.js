"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var Interrupt = (function (_super) {
    __extends(Interrupt, _super);
    function Interrupt() {
        _super.apply(this, arguments);
    }
    Interrupt.prototype.execute = function (cpu) {
        cpu.onInterrupt.emit(this.number.getValue());
        return cpu.getNextInstruction();
    };
    Interrupt.prototype.loadParameters = function (number) {
        this.number = number;
    };
    return Interrupt;
}(instruction_1.UnaryReadOperation));
exports.Interrupt = Interrupt;
//# sourceMappingURL=interrupt.js.map