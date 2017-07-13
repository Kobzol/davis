"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parameter_1 = require("./parameter");
var Instruction = (function () {
    function Instruction() {
    }
    Object.defineProperty(Instruction, "BINARY_WRITE_READ_PARAMS", {
        get: function () {
            return [
                [parameter_1.Parameter.Reg, parameter_1.Parameter.Reg],
                [parameter_1.Parameter.Reg, parameter_1.Parameter.Constant],
                [parameter_1.Parameter.Reg, parameter_1.Parameter.DerefConstant],
                [parameter_1.Parameter.Reg, parameter_1.Parameter.Memory],
                [parameter_1.Parameter.Memory, parameter_1.Parameter.Reg],
                [parameter_1.Parameter.Memory, parameter_1.Parameter.Constant],
                [parameter_1.Parameter.DerefConstant, parameter_1.Parameter.Reg],
                [parameter_1.Parameter.DerefConstant, parameter_1.Parameter.Constant]
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Instruction, "UNARY_READ_PARAMS", {
        get: function () {
            return [
                [parameter_1.Parameter.Constant],
                [parameter_1.Parameter.Reg],
                [parameter_1.Parameter.Memory],
                [parameter_1.Parameter.DerefConstant]
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Instruction, "UNARY_WRITE_PARAMS", {
        get: function () {
            return [
                [parameter_1.Parameter.Reg],
                [parameter_1.Parameter.Memory],
                [parameter_1.Parameter.DerefConstant]
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Instruction.prototype, "validParameters", {
        get: function () {
            return [
                []
            ];
        },
        enumerable: true,
        configurable: true
    });
    Instruction.prototype.loadParameters = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
    };
    Instruction.prototype.toString = function () {
        return this.constructor.toString();
    };
    return Instruction;
}());
exports.Instruction = Instruction;
var UnaryOperation = (function (_super) {
    __extends(UnaryOperation, _super);
    function UnaryOperation() {
        _super.apply(this, arguments);
    }
    UnaryOperation.prototype.loadParameters = function (target) {
        this.target = target;
    };
    return UnaryOperation;
}(Instruction));
exports.UnaryOperation = UnaryOperation;
var UnaryReadOperation = (function (_super) {
    __extends(UnaryReadOperation, _super);
    function UnaryReadOperation() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(UnaryReadOperation.prototype, "validParameters", {
        get: function () {
            return Instruction.UNARY_READ_PARAMS;
        },
        enumerable: true,
        configurable: true
    });
    return UnaryReadOperation;
}(UnaryOperation));
exports.UnaryReadOperation = UnaryReadOperation;
var UnaryWriteOperation = (function (_super) {
    __extends(UnaryWriteOperation, _super);
    function UnaryWriteOperation() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(UnaryWriteOperation.prototype, "validParameters", {
        get: function () {
            return Instruction.UNARY_WRITE_PARAMS;
        },
        enumerable: true,
        configurable: true
    });
    return UnaryWriteOperation;
}(UnaryOperation));
exports.UnaryWriteOperation = UnaryWriteOperation;
var BinaryOperation = (function (_super) {
    __extends(BinaryOperation, _super);
    function BinaryOperation() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(BinaryOperation.prototype, "validParameters", {
        get: function () {
            return Instruction.BINARY_WRITE_READ_PARAMS;
        },
        enumerable: true,
        configurable: true
    });
    BinaryOperation.prototype.loadParameters = function (target, source) {
        this.target = target;
        this.source = source;
    };
    return BinaryOperation;
}(Instruction));
exports.BinaryOperation = BinaryOperation;
//# sourceMappingURL=instruction.js.map