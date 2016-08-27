import {ModalService} from "./modal.service";
import {ModalEvent, ModalEventType} from "./modal-event.class";

export abstract class ModalBase {
  
  constructor() {
    ModalService.subscribe( (modalEvent:ModalEvent)=>{
      if (modalEvent.eventType===ModalEventType.DISPLAY)
        this.onModalInit(modalEvent.componentParameters)
    });
  }
  
  abstract onModalInit(componentParameters:Object):void;
  
  close(payload:any=undefined) {
    ModalService.close(payload);
  }
}