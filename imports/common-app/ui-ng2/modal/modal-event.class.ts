import {Type } from '@angular/core';

export enum ModalEventType {
  OPEN,
  CLOSE
}
export class ModalEvent {
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
}
  