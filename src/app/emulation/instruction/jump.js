"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var instruction_1 = require("./instruction");
var Jump = (function (_super) {
    __extends(Jump, _super);
    function Jump() {
        _super.apply(this, arguments);
    }
    Jump.prototype.execute = function (cpu) {
        return this.target.getValue();
    };
    Jump.prototype.jumpIf = function (cpu, condition) {
        return condition ? this.target.getValue() : cpu.eip + 1;
    };
    return Jump;
}(instruction_1.UnaryReadOperation));
exports.Jump = Jump;
var Loop = (function (_super) {
    __extends(Loop, _super);
    function Loop() {
        _super.apply(this, arguments);
    }
    Loop.prototype.execute = function (cpu) {
        cpu.getRegisterByName("ECX").setValue(cpu.getRegisterByName("ECX").getValue() - 1);
        return this.jumpIf(cpu, cpu.getRegisterByName("ECX").getValue() !== 0);
    };
    return Loop;
}(Jump));
exports.Loop = Loop;
var LoopE = (function (_super) {
    __extends(LoopE, _super);
    function LoopE() {
        _super.apply(this, arguments);
    }
    LoopE.prototype.execute = function (cpu) {
        cpu.getRegisterByName("ECX").setValue(cpu.getRegisterByName("ECX").getValue() - 1);
        return this.jumpIf(cpu, cpu.getRegisterByName("ECX").getValue() !== 0 && cpu.statusWord.zero);
    };
    return LoopE;
}(Jump));
exports.LoopE = LoopE;
var LoopNE = (function (_super) {
    __extends(LoopNE, _super);
    function LoopNE() {
        _super.apply(this, arguments);
    }
    LoopNE.prototype.execute = function (cpu) {
        cpu.getRegisterByName("ECX").setValue(cpu.getRegisterByName("ECX").getValue() - 1);
        return this.jumpIf(cpu, cpu.getRegisterByName("ECX").getValue() !== 0 && !cpu.statusWord.zero);
    };
    return LoopNE;
}(Jump));
exports.LoopNE = LoopNE;
var JumpO = (function (_super) {
    __extends(JumpO, _super);
    function JumpO() {
        _super.apply(this, arguments);
    }
    JumpO.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.conditionUnit.overflow);
    };
    return JumpO;
}(Jump));
exports.JumpO = JumpO;
var JumpNO = (function (_super) {
    __extends(JumpNO, _super);
    function JumpNO() {
        _super.apply(this, arguments);
    }
    JumpNO.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, !cpu.conditionUnit.overflow);
    };
    return JumpNO;
}(Jump));
exports.JumpNO = JumpNO;
var JumpS = (function (_super) {
    __extends(JumpS, _super);
    function JumpS() {
        _super.apply(this, arguments);
    }
    JumpS.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.conditionUnit.sign);
    };
    return JumpS;
}(Jump));
exports.JumpS = JumpS;
var JumpNS = (function (_super) {
    __extends(JumpNS, _super);
    function JumpNS() {
        _super.apply(this, arguments);
    }
    JumpNS.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, !cpu.conditionUnit.sign);
    };
    return JumpNS;
}(Jump));
exports.JumpNS = JumpNS;
var JumpE = (function (_super) {
    __extends(JumpE, _super);
    function JumpE() {
        _super.apply(this, arguments);
    }
    JumpE.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.conditionUnit.equal);
    };
    return JumpE;
}(Jump));
exports.JumpE = JumpE;
var JumpNE = (function (_super) {
    __extends(JumpNE, _super);
    function JumpNE() {
        _super.apply(this, arguments);
    }
    JumpNE.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, !cpu.conditionUnit.equal);
    };
    return JumpNE;
}(Jump));
exports.JumpNE = JumpNE;
var JumpB = (function (_super) {
    __extends(JumpB, _super);
    function JumpB() {
        _super.apply(this, arguments);
    }
    JumpB.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.conditionUnit.below);
    };
    return JumpB;
}(Jump));
exports.JumpB = JumpB;
var JumpAE = (function (_super) {
    __extends(JumpAE, _super);
    function JumpAE() {
        _super.apply(this, arguments);
    }
    JumpAE.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, !cpu.conditionUnit.below);
    };
    return JumpAE;
}(Jump));
exports.JumpAE = JumpAE;
var JumpA = (function (_super) {
    __extends(JumpA, _super);
    function JumpA() {
        _super.apply(this, arguments);
    }
    JumpA.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.conditionUnit.above);
    };
    return JumpA;
}(Jump));
exports.JumpA = JumpA;
var JumpBE = (function (_super) {
    __extends(JumpBE, _super);
    function JumpBE() {
        _super.apply(this, arguments);
    }
    JumpBE.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, !cpu.conditionUnit.above);
    };
    return JumpBE;
}(Jump));
exports.JumpBE = JumpBE;
var JumpL = (function (_super) {
    __extends(JumpL, _super);
    function JumpL() {
        _super.apply(this, arguments);
    }
    JumpL.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.conditionUnit.less);
    };
    return JumpL;
}(Jump));
exports.JumpL = JumpL;
var JumpGE = (function (_super) {
    __extends(JumpGE, _super);
    function JumpGE() {
        _super.apply(this, arguments);
    }
    JumpGE.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, !cpu.conditionUnit.less);
    };
    return JumpGE;
}(Jump));
exports.JumpGE = JumpGE;
var JumpLE = (function (_super) {
    __extends(JumpLE, _super);
    function JumpLE() {
        _super.apply(this, arguments);
    }
    JumpLE.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, !cpu.conditionUnit.greater);
    };
    return JumpLE;
}(Jump));
exports.JumpLE = JumpLE;
var JumpG = (function (_super) {
    __extends(JumpG, _super);
    function JumpG() {
        _super.apply(this, arguments);
    }
    JumpG.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.conditionUnit.greater);
    };
    return JumpG;
}(Jump));
exports.JumpG = JumpG;
var JumpP = (function (_super) {
    __extends(JumpP, _super);
    function JumpP() {
        _super.apply(this, arguments);
    }
    JumpP.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.conditionUnit.parity);
    };
    return JumpP;
}(Jump));
exports.JumpP = JumpP;
var JumpNP = (function (_super) {
    __extends(JumpNP, _super);
    function JumpNP() {
        _super.apply(this, arguments);
    }
    JumpNP.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, !cpu.conditionUnit.parity);
    };
    return JumpNP;
}(Jump));
exports.JumpNP = JumpNP;
var JumpCXZ = (function (_super) {
    __extends(JumpCXZ, _super);
    function JumpCXZ() {
        _super.apply(this, arguments);
    }
    JumpCXZ.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.getRegisterByName("CX").getValue() === 0);
    };
    return JumpCXZ;
}(Jump));
exports.JumpCXZ = JumpCXZ;
var JumpECXZ = (function (_super) {
    __extends(JumpECXZ, _super);
    function JumpECXZ() {
        _super.apply(this, arguments);
    }
    JumpECXZ.prototype.execute = function (cpu) {
        return this.jumpIf(cpu, cpu.getRegisterByName("ECX").getValue() === 0);
    };
    return JumpECXZ;
}(Jump));
exports.JumpECXZ = JumpECXZ;
//# sourceMappingURL=jump.js.map