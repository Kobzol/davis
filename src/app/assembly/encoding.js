"use strict";
var _ = require("lodash");
var EncodedInstruction = (function () {
    function EncodedInstruction(instruction, parameters) {
        this.instruction = instruction;
        this.parameters = parameters;
    }
    EncodedInstruction.prototype.instantiate = function (cpu) {
        var data = _.map(this.parameters, function (parameter) { return parameter.fetchData(cpu); });
        this.instruction.loadParameters.apply(this.instruction, data);
        return this.instruction;
    };
    return EncodedInstruction;
}());
exports.EncodedInstruction = EncodedInstruction;
//# sourceMappingURL=encoding.js.map