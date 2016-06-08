import {Component, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
let ace = require("brace");

@Component({
    selector: "asm-editor",
    templateUrl: "app/gui/asm-editor/asm-editor.html"
})
export class AsmEditor
{
    @Output() public compile: EventEmitter<string> = new EventEmitter<string>();
    //noinspection TypeScriptValidateTypes
    @ViewChild("editor") public editor: ElementRef;

    private aceEditor: any;

    ngAfterViewInit()
    {
        const el = this.editor.nativeElement;
        this.aceEditor = ace.edit(el);
        this.aceEditor.getSession().setMode("ace/mode/assembly_x86");
    }

    private onCompile(event: any)
    {
        this.compile.emit(this.aceEditor.getValue());
    }
}
