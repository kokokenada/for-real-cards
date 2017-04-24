import { OnInit } from '@angular/core';
import { select } from '@angular-redux/store';
import { IModalState } from "../../ui/redux/modal/modal.types";
import { ModalActions } from "../../ui/redux/modal/modal-actions.class";

export abstract class ModalBase<PARAMS, RESULT> implements OnInit{
  @select() modalReducer$;
  protected params:PARAMS;

  ngOnInit(){
    this.modalReducer$.subscribe(
      (state:IModalState<PARAMS, RESULT>)=>{
        this.params = state.params;
      }
    );
  }

  close(payload:RESULT=undefined) {
    ModalActions.resolveRequest(payload);
  }
}
