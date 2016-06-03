import {Subject, Subscription} from 'rxjs';
import {Type } from '@angular/core';

export enum ModalEventType {
  OPEN,
  CLOSE
}
export class ModalEvent {
  static modalSubject:Subject = new Subject();
  eventType: ModalEventType;
  payload:any;
  componentParameters: Object;
  componentSelector: string;
  componentType: Type;
  constructor(eventType:ModalEventType, 
              options: {
                payload?:any, 
                componentSelector?:string,
                componentType?:Type,
                componentParameters?:Object}={}) 
  {
    this.eventType = eventType;
    this.payload = options.payload;
    this.componentParameters = options.componentParameters;
    this.componentSelector = options.componentSelector;
    this.componentType = options.componentType;
  }

  static pushEvent(event:ModalEvent):void {
    ModalEvent.modalSubject.next(event);
    if (event.eventType===ModalEventType.CLOSE) {
      ModalEvent.modalSubject.complete();
    }
  }

  static subscribe(onNext:(event:ModalEvent)=>void, onError:(error:any)=>void=null, onComplete:()=>void=null):Subscription {
    return ModalEvent.modalSubject.subscribe(onNext, onError, onComplete)
  }


}
  