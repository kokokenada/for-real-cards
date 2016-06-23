import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';
import ionicSelector from 'ionic-selector';

import { PlatformTools, TargetPlatformId } from '../imports/common-app/api/index';
console.log("Setting platform")
if (Meteor.isCordova) {
  PlatformTools.setTargetPlatform(TargetPlatformId.IONIC)
} else {
  PlatformTools.setTargetPlatform(TargetPlatformId.TWBS_WEB)
}

import { enableProdMode } from '@angular/core';
import { run as runWeb } from "../imports/for-real-cards/top-frame/top-frame.web";
import { run as runMobile } from "../imports/for-real-cards/top-frame/top-frame.ionic";


console.log("In apps.ts @" + new Date());
console.log(Meteor.absoluteUrl());

if (Meteor.isProduction) {
  console.log("Production environment detected.  Log level set to error");
  log.setLevel(LogLevel.ERROR);
  enableProdMode();
} else {
  console.log("Development environment detected.  Log level set to info");
  log.setLevel(LogLevel.TRACE);
}

console.log("Setting platform")
if (Meteor.isCordova) {
  document.addEventListener('deviceready', () => {
    ionicSelector('for-real-cards-top-frame');
    runMobile();
//    setClass('mobile');
  });
} else {
  runWeb();
//  setClass('web');
}
