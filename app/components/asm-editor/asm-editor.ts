import {Component, Output, EventEmitter, ViewChild, ElementRef, Input} from "@angular/core";
import _ = require("lodash");
let ace = require("brace");

@Component({
    selector: "asm-editor",
    templateUrl: "app/components/asm-editor/asm-editor.html"
})
export class AsmEditor
{
    @Output() compile: EventEmitter<string> = new EventEmitter<string>();
    @Output() breakpointChange: EventEmitter<number[]> = new EventEmitter<number[]>();

    @ViewChild("editor") editor: ElementRef;
    private aceEditor: any = null;

    private breakpoints: number[] = [];
    private _activeLine: number = null;
    static ACTIVE_LINE_CLASS: string = "active-line";

    @Input() set activeLine(value: number)
    {
        if (this.aceEditor === null) return;

        this.removeActiveLine();

        if (value !== null)
        {
            this._activeLine = value;
            this.aceEditor.session.addGutterDecoration(value, AsmEditor.ACTIVE_LINE_CLASS);
            this.aceEditor.gotoLine(value + 1);
        }
    }

    ngAfterViewInit()
    {
        const el = this.editor.nativeElement;
        this.aceEditor = ace.edit(el);
        this.aceEditor.session.setMode("ace/mode/assembly_x86");
        this.aceEditor.on("guttermousedown", (e: any) =>
        {
            var target = e.domEvent.target;
            if (target.className.indexOf("ace_gutter-cell") === -1)
                return;

            var row = e.getDocumentPosition().row;
            this.toggleBreakpoint(row);
            e.stop();
        });
    }

    private toggleBreakpoint(row: number)
    {
        if (this.hasBreakpoint(row))
        {
            this.aceEditor.session.clearBreakpoint(row);
            _.remove(this.breakpoints, (value: number) => value == row);
        }
        else
        {
            this.aceEditor.session.setBreakpoint(row);
            this.breakpoints.push(row);
        }

        this.breakpointChange.emit(this.breakpoints);
    }
    private hasBreakpoint(row: number): boolean
    {
        return _.includes(this.breakpoints, row);
    }

    private removeActiveLine()
    {
        if (this._activeLine !== -1)
        {
            this.aceEditor.session.removeGutterDecoration(this._activeLine, AsmEditor.ACTIVE_LINE_CLASS);
        }
    }

    private emitCompile()
    {
        this.compile.emit(this.aceEditor.getValue());
    }
}
