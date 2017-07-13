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
var cpu_1 = require("../../emulation/cpu");
var assembler_1 = require("../../assembly/assembler");
var asm_editor_1 = require("../asm-editor/asm-editor");
var cpu_2 = require("../cpu/cpu");
var memory_1 = require("../memory/memory");
var runtime_1 = require("../../emulation/runtime");
var process_1 = require("../../emulation/process");
var execution_1 = require("../execution/execution");
var console_1 = require("../console/console");
var runtime_exception_1 = require("../../emulation/runtime-exception");
var AppComponent = (function () {
    function AppComponent() {
        this.runtime = new runtime_1.Runtime();
        this.assembler = new assembler_1.Assembler();
        this.memorySize = 256;
        this.compileErrors = "";
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        this.asmEditor.text =
            "section .data\nhello:\n    db 'Hello world!', 10, 0\n\nsection .text\n\nasd:\n    MOV EAX, hello\n    MOV [EAX], BYTE 97 ; MOV EAX, hello\n    INT 2\n    HLT";
    };
    AppComponent.prototype.compileSource = function (source) {
        var _this = this;
        try {
            var program = this.assembler.assemble(source);
            var memory = new memory_block_1.MemoryBlock(this.memorySize);
            this.cpu = new cpu_1.CPU(program, memory);
            this.cpu.onInterrupt.subscribe(function (interrupt) { return _this.handleInterrupt(interrupt); });
            this.cpu.onError.subscribe(function (runtimeException) { return alert(runtimeException.message); });
            this.cpu.breakpoints = this.asmEditor.breakpoints;
            this.runtime.process = new process_1.Process(this.cpu);
            this.compileErrors = "";
        }
        catch (e) {
            if (e instanceof assembler_1.AssemblyException) {
                this.compileErrors = "Error at line " + e.line + ": " + e.message;
            }
            else {
                throw e;
            }
        }
    };
    AppComponent.prototype.handleInterrupt = function (interrupt) {
        try {
            switch (interrupt) {
                case cpu_1.Interrupt.WRITE_NUM:
                    this.print(this.cpu.getRegisterByName("EAX").getValue().toString());
                    break;
                case cpu_1.Interrupt.WRITE_STRING:
                    {
                        var data = "";
                        var start = this.cpu.getRegisterByName("EAX").getValue();
                        while (true) {
                            var char = this.cpu.derefAddress(start, 1).getValue();
                            if (char === 0) {
                                break;
                            }
                            data += String.fromCharCode(char);
                            start++;
                        }
                        this.print(data);
                        break;
                    }
                default:
                    {
                        throw new runtime_exception_1.RuntimeException("Unknown interrupt code: " + interrupt);
                    }
            }
        }
        catch (e) {
            this.cpu.pause();
            alert(e.message);
        }
    };
    AppComponent.prototype.print = function (value) {
        this.console.print(value);
    };
    AppComponent.prototype.onBreakpointChanged = function (breakpoints) {
        if (this.runtime.hasProcess()) {
            this.runtime.process.cpu.breakpoints = breakpoints;
        }
    };
    AppComponent.prototype.getActiveLine = function () {
        if (this.runtime.hasProcess() && this.runtime.process.isStarted()) {
            return this.runtime.process.cpu.activeLine;
        }
        else {
            return null;
        }
    };
    __decorate([
        core_1.ViewChild(asm_editor_1.AsmEditorComponent), 
        __metadata('design:type', asm_editor_1.AsmEditorComponent)
    ], AppComponent.prototype, "asmEditor", void 0);
    __decorate([
        core_1.ViewChild(console_1.ConsoleComponent), 
        __metadata('design:type', console_1.ConsoleComponent)
    ], AppComponent.prototype, "console", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: "app",
            templateUrl: ".html",
            directives: [asm_editor_1.AsmEditorComponent, cpu_2.CpuComponent, memory_1.MemoryComponent, execution_1.ExecutionComponent, console_1.ConsoleComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.js.map