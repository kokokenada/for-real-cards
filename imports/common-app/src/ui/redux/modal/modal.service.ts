import { Injectable, Component } from '@angular/core';
import {Subscription} from 'rxjs';
import { select } from 'ng2-redux';
import {ModalActions} from "./modal-actions.class";
import {IModalState} from "./modal.types";

@Injectable()
export class ModalService {
  inProgress:boolean = false;
  @select() modalReducer;
  subscription:Subscription;

  private checkSubscription(resolve, reject) {
    if (!this.subscription) {
      this.subscription = this.modalReducer.subscribe(
        (state:IModalState<any, any>)=>{
          console.log('IN MODAL PROMISE SUBSCRIPTION CALLBACK')
          console.log(state)
          if (state.lastEvent === ModalActions.MODAL_RESOLVE_SUCCESS) {
            console.log('RESOLVING')
            resolve(state.result);
            this.inProgress = false;
          }
        },
        (error)=>{
          reject(error);
          this.inProgress = false;
        }
      );
    }
  }

  asPromise<PARAMS, RESULT>(compoent:Component, params:PARAMS):Promise<RESULT> {
    return new Promise<RESULT>( (resolve, reject)=>{
      if (this.inProgress) {
        reject("Modal promise currently in progress");
      } else {
        this.inProgress = true;
        this.checkSubscription(resolve, reject);
        ModalActions.openRequest(compoent, params);
      }
    });
  }
}
