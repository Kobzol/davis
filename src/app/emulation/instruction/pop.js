"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var Pop = (function (_super) {
    __extends(Pop, _super);
    function Pop() {
        _super.apply(this, arguments);
    }
    Pop.prototype.execute = function (cpu) {
        this.target.setValue(cpu.pop());
        return cpu.getNextInstruction();
    };
    return Pop;
}(instruction_1.UnaryWriteOperation));
exports.Pop = Pop;
//# sourceMappingURL=pop.js.map