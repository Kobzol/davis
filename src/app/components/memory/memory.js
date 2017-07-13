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
var memory_block_1 = require("../../emulation/memory-block");
var _ = require("lodash");
var MemoryComponent = (function () {
    function MemoryComponent() {
        this._ascii = false;
        this.memory = null;
        this.wordSize = 1;
        this.width = 10;
    }
    Object.defineProperty(MemoryComponent.prototype, "ascii", {
        get: function () {
            return this._ascii;
        },
        set: function (value) {
            if (value) {
                this.wordSize = 1;
            }
            this._ascii = value;
        },
        enumerable: true,
        configurable: true
    });
    MemoryComponent.prototype.getRowCount = function () {
        return Math.ceil(this.memory.size / this.width / this.wordSize);
    };
    MemoryComponent.prototype.createRange = function (count) {
        return _.range(count);
    };
    MemoryComponent.prototype.createAddress = function (row, col) {
        return row * this.width * this.wordSize + col * this.wordSize;
    };
    MemoryComponent.prototype.getCellValue = function (address) {
        var value = this.memory.load(address, this.wordSize).getValue();
        if (this._ascii) {
            return String.fromCharCode(value);
        }
        else {
            return value.toString();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', memory_block_1.MemoryBlock)
    ], MemoryComponent.prototype, "memory", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MemoryComponent.prototype, "wordSize", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MemoryComponent.prototype, "width", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], MemoryComponent.prototype, "ascii", null);
    MemoryComponent = __decorate([
        core_1.Component({
            selector: "memory",
            templateUrl: "./memory.html"
        }), 
        __metadata('design:paramtypes', [])
    ], MemoryComponent);
    return MemoryComponent;
}());
exports.MemoryComponent = MemoryComponent;
//# sourceMappingURL=memory.js.map