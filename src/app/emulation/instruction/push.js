"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var Push = (function (_super) {
    __extends(Push, _super);
    function Push() {
        _super.apply(this, arguments);
    }
    Push.prototype.execute = function (cpu) {
        cpu.push(this.target.getValue());
        return cpu.getNextInstruction();
    };
    return Push;
}(instruction_1.UnaryReadOperation));
exports.Push = Push;
//# sourceMappingURL=push.js.map