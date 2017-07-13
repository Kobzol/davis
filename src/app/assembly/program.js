"use strict";
var _ = require("lodash");
var LineMap = (function () {
    function LineMap() {
        this.mapping = {};
    }
    LineMap.prototype.mapLine = function (address, line) {
        this.mapping[address] = line;
    };
    LineMap.prototype.getLineByAddress = function (address) {
        return _.findLast(this.mapping, function (line, key) { return key <= address; });
    };
    LineMap.prototype.getAddressByLine = function (row) {
        return Number(_.findKey(this.mapping, function (line) { return line === row; }));
    };
    return LineMap;
}());
exports.LineMap = LineMap;
var Program = (function () {
    function Program(_instructions, _memoryDefinitions, _lineMap) {
        this._instructions = _instructions;
        this._memoryDefinitions = _memoryDefinitions;
        this._lineMap = _lineMap;
    }
    Object.defineProperty(Program.prototype, "instructions", {
        get: function () {
            return this._instructions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Program.prototype, "memoryDefinitions", {
        get: function () {
            return this._memoryDefinitions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Program.prototype, "lineMap", {
        get: function () {
            return this._lineMap;
        },
        enumerable: true,
        configurable: true
    });
    Program.prototype.getInstructionByAddress = function (cpu, address) {
        return this.instructions[address].instantiate(cpu);
    };
    return Program;
}());
exports.Program = Program;
//# sourceMappingURL=program.js.map