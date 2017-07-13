"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var memory_view_1 = require("../memory-view");
var Parameter = (function () {
    function Parameter(size) {
        if (size === void 0) { size = 4; }
        this.size = size;
    }
    Object.defineProperty(Parameter, "Reg", {
        get: function () { return "Reg"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameter, "Memory", {
        get: function () { return "Mem"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameter, "Constant", {
        get: function () { return "Constant"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameter, "DerefConstant", {
        get: function () { return "DerefConstant"; },
        enumerable: true,
        configurable: true
    });
    return Parameter;
}());
exports.Parameter = Parameter;
var RegisterParameter = (function (_super) {
    __extends(RegisterParameter, _super);
    function RegisterParameter(size, registerIndex) {
        _super.call(this, size);
        this.registerIndex = registerIndex;
    }
    RegisterParameter.prototype.fetchData = function (cpu) {
        return cpu.getRegisterByIndex(this.registerIndex);
    };
    return RegisterParameter;
}(Parameter));
exports.RegisterParameter = RegisterParameter;
var MemoryParameter = (function (_super) {
    __extends(MemoryParameter, _super);
    function MemoryParameter(size, baseReg, indexer) {
        _super.call(this, size);
        this.baseReg = baseReg;
        this.indexer = indexer;
    }
    MemoryParameter.prototype.fetchData = function (cpu) {
        var baseReg = cpu.getRegisterByIndex(this.baseReg);
        var indexReg = cpu.getRegisterByIndex(this.indexer.indexReg);
        return cpu.derefAddress(cpu.calculateEffectiveAddressFromRegister(baseReg, indexReg, this.indexer.multiplier, this.indexer.constant), this.size);
    };
    return MemoryParameter;
}(Parameter));
exports.MemoryParameter = MemoryParameter;
var LabelParameter = (function (_super) {
    __extends(LabelParameter, _super);
    function LabelParameter(size, _label) {
        if (_label === void 0) { _label = ""; }
        _super.call(this, size);
        this._label = _label;
        this.value = -1;
    }
    Object.defineProperty(LabelParameter.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (value) {
            this._label = value;
        },
        enumerable: true,
        configurable: true
    });
    LabelParameter.prototype.resolveLabel = function (value) {
        this.value = value;
    };
    LabelParameter.prototype.fetchData = function (cpu) {
        return new memory_view_1.NumericConstant(this.value, this.size);
    };
    return LabelParameter;
}(Parameter));
exports.LabelParameter = LabelParameter;
var DerefLabelParameter = (function (_super) {
    __extends(DerefLabelParameter, _super);
    function DerefLabelParameter(size, label, indexer) {
        if (label === void 0) { label = ""; }
        _super.call(this, size, label);
        this.indexer = indexer;
    }
    DerefLabelParameter.prototype.fetchData = function (cpu) {
        var indexReg = cpu.getRegisterByIndex(this.indexer.indexReg);
        return cpu.derefAddress(cpu.calculateEffectiveAddress(this.value, indexReg, this.indexer.multiplier, this.indexer.constant), this.size);
    };
    return DerefLabelParameter;
}(LabelParameter));
exports.DerefLabelParameter = DerefLabelParameter;
//# sourceMappingURL=parameter.js.map