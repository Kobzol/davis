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
var process_1 = require("../../emulation/process");
var ExecutionComponent = (function () {
    function ExecutionComponent() {
        this.process = null;
        this.start = new core_1.EventEmitter();
        this.stop = new core_1.EventEmitter();
        this.continueEvent = new core_1.EventEmitter();
        this.pause = new core_1.EventEmitter();
        this.step = new core_1.EventEmitter();
    }
    ExecutionComponent.prototype.onStart = function () {
        this.start.emit(this.process);
        this.process.start();
    };
    ExecutionComponent.prototype.onStop = function () {
        this.stop.emit(this.process);
        this.process.cpu.halt();
    };
    ExecutionComponent.prototype.onContinue = function () {
        this.continueEvent.emit(this.process);
        this.process.cpu.run();
    };
    ExecutionComponent.prototype.onPause = function () {
        this.pause.emit(this.process);
        this.process.cpu.pause();
    };
    ExecutionComponent.prototype.onStep = function () {
        this.step.emit(this.process);
        this.process.cpu.step();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', process_1.Process)
    ], ExecutionComponent.prototype, "process", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ExecutionComponent.prototype, "start", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ExecutionComponent.prototype, "stop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ExecutionComponent.prototype, "continueEvent", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ExecutionComponent.prototype, "pause", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ExecutionComponent.prototype, "step", void 0);
    ExecutionComponent = __decorate([
        core_1.Component({
            selector: "execution-controls",
            templateUrl: "./execution.html"
        }), 
        __metadata('design:paramtypes', [])
    ], ExecutionComponent);
    return ExecutionComponent;
}());
exports.ExecutionComponent = ExecutionComponent;
//# sourceMappingURL=execution.js.map