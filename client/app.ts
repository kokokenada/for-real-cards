import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';
//import ionicSelector from 'ionic-selector';
import {featureToggleConfigs} from '../imports/for-real-cards/top-frame/feature-toggle.config';
let run:any;
declare let require:any;

import { PlatformTools, TargetPlatformId } from '../imports/common-app/src/ui-ng2/platform-tools/platform-tools';
if (Meteor.isCordova) {
  if (featureToggleConfigs['mobile-ionic'].setting) {
    console.log("Cordova detected. Setting platform to IONIC.");
    PlatformTools.setTargetPlatform(TargetPlatformId.IONIC);
    run =  require("../imports/for-real-cards/top-frame/top-frame.ionic").run;
  } else {
    console.log("Cordova detected. Setting platform to TWBS_WEB.");
    PlatformTools.setTargetPlatform(TargetPlatformId.TWBS_WEB);
    run =  require("../imports/for-real-cards/top-frame/top-frame.twbs.ts").run;
  }
} else {
  if (featureToggleConfigs['desktop-ionic'].setting) {
    console.log("Setting platform to IONIC while in desktop mode");
    PlatformTools.setTargetPlatform(TargetPlatformId.IONIC);
    run =  require("../imports/for-real-cards/top-frame/top-frame.ionic").run;
  } else {
    console.log("Setting platform to TWBS_WEB");
    PlatformTools.setTargetPlatform(TargetPlatformId.TWBS_WEB);
    run =  require("../imports/for-real-cards/top-frame/top-frame.twbs.ts").run;
  }
}

import { enableProdMode } from '@angular/core';
import { prepare as prepareWeb } from "../imports/for-real-cards/top-frame/top-frame.twbs";
//import { prepare as prepareMobile } from "../imports/for-real-cards/top-frame/top-frame.ionic";


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
//  prepareMobile();
  prepareWeb();
  document.addEventListener('deviceready', () => {
    //ionicSelector('for-real-cards-top-frame');
  run();
//    setClass('mobile');
  });
} else {
  prepareWeb();
  run();
//  setClass('web');
}
