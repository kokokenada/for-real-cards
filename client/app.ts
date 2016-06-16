import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';

import { provide, enableProdMode } from '@angular/core';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import {ForRealCardsTopFrame} from "../imports/for-real-cards/index";

import { bootstrap } from '@angular/platform-browser-dynamic';

console.log("In apps.ts @" + new Date());
console.log(Meteor.absoluteUrl());

if (Meteor.isProduction) {
  console.log("Production environment detected.  Log level set to error");
  log.setLevel(LogLevel.ERROR);
  enableProdMode();
} else {
  console.log("Development environment detected.  Log level set to info");
  log.setLevel(LogLevel.INFO);
}

Meteor.setTimeout(()=>{
  bootstrap(ForRealCardsTopFrame,
    [
      provide(APP_BASE_HREF, { useValue: '/' }),
      ROUTER_PROVIDERS,
      ROUTER_DIRECTIVES,
      provide(LocationStrategy,
        {useClass: HashLocationStrategy})
    ]
  );
}, 1000);
