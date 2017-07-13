"use strict";
var _ = require("lodash");
var memory_block_1 = require("./memory-block");
var memory_view_1 = require("./memory-view");
var alu_1 = require("./alu");
var core_1 = require("@angular/core");
var runtime_exception_1 = require("./runtime-exception");
var condition_unit_1 = require("./condition-unit");
var status_word_1 = require("./status-word");
var RegisterInfo = (function () {
    function RegisterInfo(id, bank, byteSize, index) {
        if (index === void 0) { index = 0; }
        this._id = id;
        this._bank = bank;
        this._byteSize = byteSize;
        this._index = index;
    }
    Object.defineProperty(RegisterInfo.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterInfo.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterInfo.prototype, "byteSize", {
        get: function () {
            return this._byteSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterInfo.prototype, "bank", {
        get: function () {
            return this._bank;
        },
        enumerable: true,
        configurable: true
    });
    return RegisterInfo;
}());
(function (Interrupt) {
    Interrupt[Interrupt["WRITE_NUM"] = 1] = "WRITE_NUM";
    Interrupt[Interrupt["WRITE_STRING"] = 2] = "WRITE_STRING";
})(exports.Interrupt || (exports.Interrupt = {}));
var Interrupt = exports.Interrupt;
exports.REGISTER_INDEX = {
    NULL: new RegisterInfo(0, 0, 4),
    EIP: new RegisterInfo(1, 1, 4),
    EBP: new RegisterInfo(2, 2, 4),
    ESP: new RegisterInfo(3, 3, 4),
    ESI: new RegisterInfo(4, 4, 4),
    SI: new RegisterInfo(5, 4, 2),
    EDI: new RegisterInfo(6, 5, 4),
    DI: new RegisterInfo(7, 5, 2),
    EAX: new RegisterInfo(20, 6, 4),
    AX: new RegisterInfo(21, 6, 2),
    AH: new RegisterInfo(22, 6, 1, 1),
    AL: new RegisterInfo(23, 6, 1),
    EBX: new RegisterInfo(24, 7, 4),
    BX: new RegisterInfo(25, 7, 2),
    BH: new RegisterInfo(26, 7, 1, 1),
    BL: new RegisterInfo(27, 7, 1),
    ECX: new RegisterInfo(28, 8, 4),
    CX: new RegisterInfo(29, 8, 2),
    CH: new RegisterInfo(30, 8, 1, 1),
    CL: new RegisterInfo(31, 8, 1),
    EDX: new RegisterInfo(32, 9, 4),
    DX: new RegisterInfo(33, 9, 2),
    DH: new RegisterInfo(34, 9, 1, 1),
    DL: new RegisterInfo(35, 9, 1)
};
var CPU = (function () {
    function CPU(_program, _memory, _tickRate) {
        var _this = this;
        if (_tickRate === void 0) { _tickRate = 500; }
        this._program = _program;
        this._memory = _memory;
        this._tickRate = _tickRate;
        this.status = new status_word_1.StatusWord();
        this._registerMap = {};
        this._onInterrupt = new core_1.EventEmitter();
        this._onExit = new core_1.EventEmitter();
        this._onError = new core_1.EventEmitter();
        this._running = false;
        this.stoppedOnBreakpoint = false;
        this.scheduleTimeout = null;
        this.registers = _.map(_.range(10), function () { return new memory_block_1.MemoryBlock(4); });
        this._alu = new alu_1.ALU(this);
        this._conditionUnit = new condition_unit_1.ConditionUnit(this);
        _.keys(exports.REGISTER_INDEX).forEach(function (key) {
            var reg = exports.REGISTER_INDEX[key];
            _this._registerMap[key] = new memory_view_1.MemoryView(_this.registers[reg.bank], reg.byteSize, reg.index);
        });
        this.reset();
    }
    Object.defineProperty(CPU.prototype, "tickRate", {
        get: function () {
            return this._tickRate;
        },
        set: function (value) {
            this._tickRate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "eip", {
        get: function () {
            return this.registerMap["EIP"].getValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "statusWord", {
        get: function () {
            return this.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "memory", {
        get: function () {
            return this._memory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "program", {
        get: function () {
            return this._program;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "onInterrupt", {
        get: function () {
            return this._onInterrupt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "onExit", {
        get: function () {
            return this._onExit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "onError", {
        get: function () {
            return this._onError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "alu", {
        get: function () {
            return this._alu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "conditionUnit", {
        get: function () {
            return this._conditionUnit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "registerMap", {
        get: function () {
            return this._registerMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "running", {
        get: function () {
            return this._running;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "activeLine", {
        get: function () {
            return this.program.lineMap.getLineByAddress(this.eip);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "breakpoints", {
        set: function (value) {
            var _this = this;
            this._breakpoints = _.filter(_.map(value, function (row) { return _this.program.lineMap.getAddressByLine(row); }), function (breakpoint) { return breakpoint !== null; });
        },
        enumerable: true,
        configurable: true
    });
    CPU.prototype.reset = function () {
        this.getRegisterByName("EIP").setValue(0);
        this.getRegisterByName("ESP").setValue(this.memory.size);
        this.getRegisterByName("EBP").setValue(this.memory.size);
    };
    CPU.prototype.step = function () {
        if (this.isFinished()) {
            this.halt();
            return;
        }
        if (this.hasBreakpoint()) {
            if (!this.stoppedOnBreakpoint) {
                this.stoppedOnBreakpoint = true;
                this.pause();
                return;
            }
            else {
                this.stoppedOnBreakpoint = false;
            }
        }
        this.executeOneInstruction();
    };
    CPU.prototype.run = function () {
        this._running = true;
        this.scheduleRun();
    };
    CPU.prototype.runSync = function () {
        this._running = true;
        while (this._running) {
            this.step();
        }
    };
    CPU.prototype.pause = function () {
        this._running = false;
        this.clearScheduledRun();
    };
    CPU.prototype.halt = function () {
        this.pause();
        this.onExit.emit(this);
    };
    CPU.prototype.isFinished = function () {
        return this.eip >= this.program.instructions.length;
    };
    CPU.prototype.getNextInstruction = function () {
        return this.eip + 1;
    };
    CPU.prototype.push = function (value) {
        var esp = this.getRegisterByName("ESP");
        esp.add(-4);
        this.deref(esp).setValue(value);
    };
    CPU.prototype.pop = function () {
        var esp = this.getRegisterByName("ESP");
        var value = this.deref(esp).getValue();
        esp.add(4);
        return value;
    };
    CPU.prototype.derefAddress = function (address, size) {
        if (size === void 0) { size = 4; }
        return this.deref(new memory_view_1.NumericConstant(address), size);
    };
    CPU.prototype.deref = function (memoryView, size) {
        if (size === void 0) { size = 4; }
        var address = memoryView.getValue();
        if (!this.memory.isValid(address)) {
            throw new runtime_exception_1.RuntimeException("Invalid dereference of address " + address + " at line " + this.getLine());
        }
        if (address + size > this.memory.size) {
            throw new runtime_exception_1.RuntimeException("Memory overflow at line " + this.getLine());
        }
        return this.memory.load(address, size);
    };
    CPU.prototype.calculateEffectiveAddressFromRegister = function (baseReg, indexReg, multiplier, constant) {
        if (indexReg === void 0) { indexReg = null; }
        if (multiplier === void 0) { multiplier = 1; }
        if (constant === void 0) { constant = 0; }
        return this.calculateEffectiveAddress(baseReg.getValue(), indexReg, multiplier, constant);
    };
    CPU.prototype.calculateEffectiveAddress = function (address, indexReg, multiplier, constant) {
        if (indexReg === void 0) { indexReg = null; }
        if (multiplier === void 0) { multiplier = 1; }
        if (constant === void 0) { constant = 0; }
        if (indexReg === null) {
            indexReg = this.getRegisterByName("NULL");
        }
        return address + indexReg.getValue() * multiplier + constant;
    };
    CPU.prototype.setFlags = function (value) {
        this.status.zero = value === 0;
        this.status.signum = (value & (1 << 31)) !== 0;
        var parity = 0;
        for (var i = 0; i < 8; i++) {
            parity += ((value & (1 << i)) !== 0) ? 1 : 0;
        }
        this.status.parity = parity % 2 === 0;
    };
    CPU.prototype.getRegisterByName = function (name) {
        return this.registerMap[name];
    };
    CPU.prototype.getRegisterByIndex = function (index) {
        return this.getRegisterByName(_.findKey(exports.REGISTER_INDEX, function (reg) { return reg.id === index; }));
    };
    CPU.prototype.hasBreakpoint = function () {
        return _.includes(this._breakpoints, this.eip);
    };
    CPU.prototype.executeOneInstruction = function () {
        var eip = this.eip;
        try {
            var instruction = this.loadInstruction(eip);
            var nextAddress = instruction.execute(this);
            this.getRegisterByName("EIP").setValue(nextAddress);
        }
        catch (e) {
            this.onError.emit(e);
            this.pause();
        }
    };
    CPU.prototype.loadInstruction = function (eip) {
        return this.program.getInstructionByAddress(this, eip);
    };
    CPU.prototype.getLine = function () {
        return this.program.lineMap.getLineByAddress(this.eip) + 1;
    };
    CPU.prototype.scheduleRun = function () {
        var _this = this;
        this.clearScheduledRun();
        this.scheduleTimeout = setTimeout(function () { return _this.tickStep(); }, this.tickRate);
    };
    CPU.prototype.clearScheduledRun = function () {
        if (this.scheduleTimeout !== null) {
            clearTimeout(this.scheduleTimeout);
        }
    };
    CPU.prototype.tickStep = function () {
        if (this.running) {
            this.step();
            this.scheduleRun();
        }
    };
    CPU.INTERRUPT_EXIT = 0;
    return CPU;
}());
exports.CPU = CPU;
//# sourceMappingURL=cpu.js.map