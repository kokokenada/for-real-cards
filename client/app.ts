import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';
import ionicSelector from 'ionic-selector';

import { PlatformTools, TargetPlatformId } from '../imports/common-app/api/index';
if (Meteor.isCordova) {
  console.log("Setting platform to IONIC")
  PlatformTools.setTargetPlatform(TargetPlatformId.IONIC)
} else {
  console.log("Setting platform to TWBS_WEB")
  PlatformTools.setTargetPlatform(TargetPlatformId.TWBS_WEB)
}

import { enableProdMode } from '@angular/core';
import { run as runWeb } from "../imports/for-real-cards/top-frame/top-frame.twbs.ts";
import { run as runMobile } from "../imports/for-real-cards/top-frame/top-frame.ionic";
import { prepare as prepareWeb } from "../imports/for-real-cards/top-frame/top-frame.twbs.ts";
import { prepare as prepareMobile } from "../imports/for-real-cards/top-frame/top-frame.ionic";


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

if (Meteor.isCordova) {
  prepareMobile();
  document.addEventListener('deviceready', () => {
    //ionicSelector('for-real-cards-top-frame');
    runMobile();
//    setClass('mobile');
  });
} else {
  prepareWeb();
  runWeb();
//  setClass('web');
}
