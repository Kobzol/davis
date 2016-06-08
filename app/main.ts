import {bootstrap}    from '@angular/platform-browser-dynamic';
import {App} from './gui/app/app';
import {Level, Logger, Options} from "angular2-logger/core";
import {provide} from "@angular/core";

bootstrap(App, [
    provide(Options, { useValue: <Options>{ level: Level.LOG } } ),
    Logger
]);
