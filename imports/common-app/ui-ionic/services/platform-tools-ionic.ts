//import { require } from 'meteor/modules'
declare var require:any;

import { Injectable, Injector } from '@angular/core'

import { NavParams } from 'ionic-angular';

import {ModalEventType, ModalEvent} from "../../ui-ng2/modal/modal-event.class";
import {ModalService} from "../../ui-ng2/modal/modal.service";
import {Modal} from 'ionic-angular';

@Injectable()
export class PlatformToolsIonic {
  private static nav:any;  
  static initializeWithRouter(nav:any) {
    PlatformToolsIonic.nav = nav;
    let modalInstance;
    ModalService.subscribe((modalEvent:ModalEvent)=> {
      if (modalEvent.eventType === ModalEventType.OPEN) {
        modalInstance = Modal.create(modalEvent.componentType, modalEvent.componentParameters);
        nav.present(modalInstance).then(
          (result)=>{
            ModalService.notifyDisplayed();
          }
        );
      } else if (modalEvent.eventType === ModalEventType.CLOSE) {
        modalInstance.dismiss();
      }
    });
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