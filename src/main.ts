import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

declare var PRODUCTION: boolean;

if (PRODUCTION)
{
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
