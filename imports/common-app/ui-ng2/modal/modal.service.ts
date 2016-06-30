
import { Subject, Subscription } from 'rxjs';
import { Injectable, Type } from '@angular/core';
import * as log from 'loglevel';

import { ModalEvent, ModalEventType } from "./modal-event.class";

@Injectable()
export class ModalService {
  private static modalSubject:Subject<ModalEvent> = new Subject();  // A subject for all modals (for managing display)
  private static currentModalPromiseResolver = null; // A promise resolver for the current modal (if we need >1, refactor to tie promise to OPEN event)
  private static currentModalPromiseRejecter = null;
  private static currentComponentParameters:Object = null;

  static open(component:Type, selector:string, params:Object=undefined):Promise {
    return new Promise((resolve, reject)=>{
      if (ModalService.currentModalPromiseResolver) {
        log.error("modal-already-open.  (promise was still present)");
        ModalService.currentModalPromiseRejecter("modal-already-open.  (promise was still present)");
      } 
      ModalService.pushEvent(new ModalEvent(ModalEventType.OPEN, {componentSelector: selector, componentParameters: params, componentType: component}));
      ModalService.currentModalPromiseResolver = resolve;
      ModalService.currentModalPromiseRejecter = reject;
      ModalService.currentComponentParameters = params;
    });
  }
  
  static notifyDisplayed():void {
    ModalService.pushEvent(new ModalEvent(ModalEventType.DISPLAY, {componentParameters: this.currentComponentParameters}));
  }
  
  static close(result:any=undefined) {
    ModalService.pushEvent(new ModalEvent(ModalEventType.CLOSE, {payload: result}));
    if (ModalService.currentModalPromiseResolver) {
      ModalService.currentModalPromiseResolver(result);
      ModalService.currentModalPromiseResolver = null;
      ModalService.currentModalPromiseRejecter = null;
    } else {
      log.error("received close without an open (no promise found)");
    }
  }

  static error(error) {
    ModalService.currentModalPromiseRejecter(error);
    ModalService.currentModalPromiseResolver = null;
    ModalService.currentModalPromiseRejecter = null;
  }

  private static pushEvent(event:ModalEvent):void {
    ModalService.modalSubject.next(event);
  }
  
  static subscribe(onNext:(event:ModalEvent)=>void, onError:(error:any)=>void=null, onComplete:()=>void=null):Subscription {
    return ModalService.modalSubject.subscribe(onNext, onError, onComplete)
  }
}
