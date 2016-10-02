import { Injectable, Component } from '@angular/core';
import {Subscription} from 'rxjs';
import { select } from 'ng2-redux';
import {ModalActions} from "./modal-actions.class";
import {IModalState} from "./modal.types";

@Injectable()
export class ModalService {
  inProgress:boolean = false;
  @select() modalReducer;

  asPromise<PARAMS, RESULT>(compoent:Component, params:PARAMS):Promise<RESULT> {
    return new Promise<RESULT>( (resolve, reject)=>{
      if (this.inProgress) {
        reject("Modal promise currently in progress");
      } else {
        this.inProgress = true;
        const subscription:Subscription = this.modalReducer.subscribe(
          (state:IModalState<PARAMS, RESULT>)=>{
            if (state.lastEvent === ModalActions.MODAL_RESOLVE_SUCCESS) {
              resolve(state.result);
              subscription.unsubscribe();
              this.inProgress = false;
            }
          },
          (error)=>{
            reject(error);
            subscription.unsubscribe();
            this.inProgress = false;
          }
        );
        ModalActions.openRequest(compoent, params);
      }
    });
  }
}
