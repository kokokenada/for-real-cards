import { select } from 'ng2-redux';

import { Injectable, Component } from '@angular/core';
import {ModalActions} from "../../ui/redux/modal/modal-actions.class";

@Injectable()
export class ModalService {
  @select() modalReducer;
  constructor(private modalActions:ModalActions) {
  }

  asPromise<T>(compoent:Component, params:any={}):Promise<T> {
    return new Promise<T>( (resolve, reject)=>{
      this.modalActions.open(compoent, params);
      this.modalReducer.subscribe(
        (result)=>{
          resolve(result);
        },
        (error)=>{
          reject(error);
        }
      )
    });
  }
}
