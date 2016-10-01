import { Injectable, Component } from '@angular/core';
import {Subscription} from 'rxjs';
import { select } from 'ng2-redux';
import {ModalActions} from "./modal-actions.class";
import {IModalState} from "./modal.types";

@Injectable()
export class ModalService {
  inProgress:boolean = false;
  @select() modalReducer;
  constructor(private modalActions:ModalActions) {
  }

  asPromise<T>(compoent:Component, params:any={}):Promise<T> {
    return new Promise<T>( (resolve, reject)=>{
      if (this.inProgress) {
        reject("Modal promise currently in progress");
      } else {
        this.inProgress = true;
        const subscription:Subscription = this.modalReducer.subscribe(
          (result:IModalState)=>{
            if (result.closing) {
              resolve(result.params);
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
        this.modalActions.openRequest(compoent, params);
      }
    });
  }
}
