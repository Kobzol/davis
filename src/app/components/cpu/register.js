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
var RegisterComponent = (function () {
    function RegisterComponent() {
        this.cpu = null;
        this.name = "";
    }
    RegisterComponent.prototype.getValue = function () {
        return this.cpu.getRegisterByName(this.name).getValue();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', cpu_1.CPU)
    ], RegisterComponent.prototype, "cpu", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RegisterComponent.prototype, "name", void 0);
    RegisterComponent = __decorate([
        core_1.Component({
            selector: "register",
            templateUrl: "./register.html"
        }), 
        __metadata('design:paramtypes', [])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.js.map