import * as log from 'loglevel';

import { Subject} from 'rxjs';
import { Injectable, Type } from '@angular/core';

import { ModalEvent, ModalEventType } from "./modal-event.class";

@Injectable()
export class ModalService {
  private static subject:Subject;
  private static staticModalInstance;
  private static template:string;
  // private  modalElement;
  private static returnUrl:string;
  constructor() {
  }
  
  open(component:Type, selector:string, params:Object=undefined):Subject<ModalEvent> {

    console.log("modal open");
    ModalEvent.pushEvent(new ModalEvent(ModalEventType.OPEN, {componentSelector: selector, componentParameters: params, componentType: component}))


/*    TODO figure out how to automatically add modal-dialog to document, this version requires it to be user defined

let el = document.getElementById("common-app.modal");
    if (!el) {
      let debugInfo:any;
      el = this.renderer.createElement(document.rootElement, "div", debugInfo);
      this.renderer.setElementAttribute(el, "id", "common-app.modal");
      console.log(el)
    }
    this.componentFactory.selector = selector;
    let componentRef = this.componentFactory.create(this.injector);
*/
    return ModalEvent.modalSubject;
  }
  
  close(result:any=undefined) {
    ModalEvent.pushEvent(new ModalEvent(ModalEventType.CLOSE, {payload: result}));
  }

}

export let MODAL_PROVIDERS:any[] = [
  ModalService
];
