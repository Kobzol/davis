"use strict";
var Process = (function () {
    function Process(_cpu) {
        var _this = this;
        this._cpu = _cpu;
        this.started = false;
        this.cpu.onExit.subscribe(function (cpu) { return _this.started = false; });
    }
    Object.defineProperty(Process.prototype, "cpu", {
        get: function () {
            return this._cpu;
        },
        enumerable: true,
        configurable: true
    });
    Process.prototype.start = function (sync) {
        if (sync === void 0) { sync = false; }
        this.started = true;
        this.reset();
        this.initMemory();
        if (sync) {
            this.cpu.runSync();
        }
        else
            this.cpu.run();
    };
    Process.prototype.isStarted = function () {
        return this.started;
    };
    Process.prototype.isRunning = function () {
        return this.isStarted() && this.cpu.running;
    };
    Process.prototype.isPaused = function () {
        return this.isStarted() && !this.cpu.running;
    };
    Process.prototype.reset = function () {
        this.cpu.reset();
        this.cpu.memory.clear();
    };
    Process.prototype.initMemory = function () {
        var memoryDefinitions = this.cpu.program.memoryDefinitions;
        var memory = this.cpu.memory;
        for (var _i = 0, memoryDefinitions_1 = memoryDefinitions; _i < memoryDefinitions_1.length; _i++) {
            var memoryDef = memoryDefinitions_1[_i];
            memory.load(memoryDef.address, memoryDef.size).setValue(memoryDef.value);
        }
    };
    return Process;
}());
exports.Process = Process;
//# sourceMappingURL=process.js.map