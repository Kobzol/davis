"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var Halt = (function (_super) {
    __extends(Halt, _super);
    function Halt() {
        _super.apply(this, arguments);
    }
    Halt.prototype.execute = function (cpu) {
        cpu.halt();
        return cpu.eip;
    };
    return Halt;
}(instruction_1.Instruction));
exports.Halt = Halt;
//# sourceMappingURL=halt.js.map