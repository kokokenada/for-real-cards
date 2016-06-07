import 'reflect-metadata';
import { Meteor } from 'meteor/meteor';
declare var cordova:any;
declare var require:any;
if (Meteor.isCordova && cordova.platformId==="android") {
  // https://github.com/Urigo/angular2-meteor/issues/273
  console.log("require 'zone.js/dist/zone'");
  require('zone.js/dist/zone');
}
import { provide } from '@angular/core';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { bootstrap } from '@angular/platform-browser-dynamic';

import {ForRealCardsTopFrame} from "../imports/for-real-cards";

bootstrap(ForRealCardsTopFrame,
    [
      provide(APP_BASE_HREF, { useValue: '/' }),
      ROUTER_PROVIDERS,
      ROUTER_DIRECTIVES,
      provide(LocationStrategy,
        {useClass: HashLocationStrategy})
    ]
);
