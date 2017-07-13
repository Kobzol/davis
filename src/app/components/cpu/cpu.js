"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var cpu_1 = require("../../emulation/cpu");
var register_1 = require("./register");
var CpuComponent = (function () {
    function CpuComponent() {
        this.cpu = null;
    }
    CpuComponent.prototype.getRegisterKeys = function () {
        return ["EIP", "EAX", "EBX", "ECX", "EDX", "EBP", "ESP", "ESI", "EDI"];
    };
    CpuComponent.prototype.getFlags = function () {
        return [
            { name: "ZF", value: this.cpu.statusWord.zero },
            { name: "SF", value: this.cpu.statusWord.signum },
            { name: "OF", value: this.cpu.statusWord.overflow },
            { name: "CF", value: this.cpu.statusWord.carry },
            { name: "DF", value: this.cpu.statusWord.direction },
            { name: "PF", value: this.cpu.statusWord.parity }
        ];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', cpu_1.CPU)
    ], CpuComponent.prototype, "cpu", void 0);
    CpuComponent = __decorate([
        core_1.Component({
            selector: "cpu",
            templateUrl: "./cpu.html",
            directives: [register_1.RegisterComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], CpuComponent);
    return CpuComponent;
}());
exports.CpuComponent = CpuComponent;
//# sourceMappingURL=cpu.js.map