//import { require } from 'meteor/modules'
declare var require:any;

import { Injectable, Injector } from '@angular/core'

//import { NavParams, Modal } from 'ionic-angular';
declare let NavParams:any;
declare let Modal:any;

@Injectable()
export class PlatformToolsIonic {
  private static nav:any;

  static initializeWithRouter(nav:any) {
    PlatformToolsIonic.nav = nav;
    let modalInstance;
  }
  private static checkInit() {
    if (!PlatformToolsIonic.nav) {
      throw "not initialized. Call initializeWithRouter";
    }
  }
  static getNav():any {
    PlatformToolsIonic.checkInit();
    return PlatformToolsIonic.nav;
  }

  static getNavParams(injector:Injector):any {
    return injector.get(NavParams);
  }

}