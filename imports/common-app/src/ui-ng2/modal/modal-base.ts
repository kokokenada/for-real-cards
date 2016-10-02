import {ModalActions} from "../../ui/redux/modal/modal-actions.class";
import { select } from 'ng2-redux';
import { OnInit } from '@angular/core';
import {IModalState} from "../../ui/redux/modal/modal.types";

export abstract class ModalBase implements OnInit{
  modalActionsBase:ModalActions;
  @select() modalReducer$;
  protected params;
  constructor(modalActions:ModalActions) { // TODO: Is there a way to get this automatically instead of making child classes pass it?
    this.modalActionsBase = modalActions;
  }
  ngOnInit(){
    this.modalReducer$.subscribe(
      (state:IModalState)=>{
        this.params = state.params;
      }
    );
  }

  close(payload:any=undefined) {
    this.modalActionsBase.resolveRequest(payload);
  }
}
