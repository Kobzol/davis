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
var _ = require("lodash");
var ace = require("brace");
var AsmEditorComponent = (function () {
    function AsmEditorComponent() {
        this.compile = new core_1.EventEmitter();
        this.breakpointChange = new core_1.EventEmitter();
        this.aceEditor = null;
        this._breakpoints = [];
        this._activeLine = null;
    }
    Object.defineProperty(AsmEditorComponent.prototype, "breakpoints", {
        get: function () {
            return this._breakpoints;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsmEditorComponent.prototype, "activeLine", {
        set: function (value) {
            if (this.aceEditor === null) {
                return;
            }
            this.removeActiveLine();
            if (value !== null) {
                this._activeLine = value;
                this.aceEditor.session.addGutterDecoration(value, AsmEditorComponent.ACTIVE_LINE_CLASS);
                this.aceEditor.gotoLine(value + 1);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsmEditorComponent.prototype, "text", {
        set: function (value) {
            if (this.aceEditor === null) {
                return;
            }
            this.aceEditor.session.getDocument().setValue(value);
        },
        enumerable: true,
        configurable: true
    });
    AsmEditorComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var el = this.editor.nativeElement;
        this.aceEditor = ace.edit(el);
        this.aceEditor.session.setMode("ace/mode/assembly_x86");
        this.aceEditor.on("guttermousedown", function (e) {
            var target = e.domEvent.target;
            if (target.className.indexOf("ace_gutter-cell") === -1) {
                return;
            }
            var row = e.getDocumentPosition().row;
            _this.toggleBreakpoint(row);
            e.stop();
        });
    };
    AsmEditorComponent.prototype.toggleBreakpoint = function (row) {
        if (this.hasBreakpoint(row)) {
            this.aceEditor.session.clearBreakpoint(row);
            _.remove(this._breakpoints, function (value) { return value === row; });
        }
        else {
            this.aceEditor.session.setBreakpoint(row);
            this._breakpoints.push(row);
        }
        this.breakpointChange.emit(this._breakpoints);
    };
    AsmEditorComponent.prototype.hasBreakpoint = function (row) {
        return _.includes(this._breakpoints, row);
    };
    AsmEditorComponent.prototype.removeActiveLine = function () {
        if (this._activeLine !== -1) {
            this.aceEditor.session.removeGutterDecoration(this._activeLine, AsmEditorComponent.ACTIVE_LINE_CLASS);
        }
    };
    AsmEditorComponent.prototype.emitCompile = function () {
        this.compile.emit(this.aceEditor.getValue());
    };
    AsmEditorComponent.ACTIVE_LINE_CLASS = "active-line";
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], AsmEditorComponent.prototype, "compile", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], AsmEditorComponent.prototype, "breakpointChange", void 0);
    __decorate([
        core_1.ViewChild("editor"), 
        __metadata('design:type', core_1.ElementRef)
    ], AsmEditorComponent.prototype, "editor", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], AsmEditorComponent.prototype, "activeLine", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], AsmEditorComponent.prototype, "text", null);
    AsmEditorComponent = __decorate([
        core_1.Component({
            selector: "asm-editor",
            templateUrl: "components/asm-editor/asm-editor.html"
        }), 
        __metadata('design:paramtypes', [])
    ], AsmEditorComponent);
    return AsmEditorComponent;
}());
exports.AsmEditorComponent = AsmEditorComponent;
//# sourceMappingURL=asm-editor.js.map