import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';
//import ionicSelector from 'ionic-selector';

let run:any;
declare let require:any;

import { PlatformTools, TargetPlatformId } from '/imports/common-app';
if (Meteor.isCordova) {
  console.log("Cordova detected. Setting platform to TWBS_WEB.");
  PlatformTools.setTargetPlatform(TargetPlatformId.TWBS_WEB); // or IONIC
  run =  require("../imports/for-real-cards/top-frame/top-frame.twbs.ts").run; // "../imports/for-real-cards/top-frame/top-frame.ionic";
} else {
  console.log("Setting platform to TWBS_WEB");
  PlatformTools.setTargetPlatform(TargetPlatformId.TWBS_WEB);
  run =  require("../imports/for-real-cards/top-frame/top-frame.twbs.ts").run;
}

import { enableProdMode } from '@angular/core';
import { prepare as prepareWeb } from "../imports/for-real-cards/top-frame/top-frame.twbs.ts";
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
