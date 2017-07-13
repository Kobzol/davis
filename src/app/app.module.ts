import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app';
import {CpuComponent} from "./components/cpu/cpu";
import {RegisterComponent} from "./components/cpu/register";
import {MemoryComponent} from "./components/memory/memory";
import {ExecutionComponent} from "./components/execution/execution";
import {ConsoleComponent} from "./components/console/console";
import {AsmEditorComponent} from "./components/asm-editor/asm-editor";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
      AppComponent,
      CpuComponent,
      RegisterComponent,
      MemoryComponent,
      ExecutionComponent,
      ConsoleComponent,
      AsmEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule
{

}
