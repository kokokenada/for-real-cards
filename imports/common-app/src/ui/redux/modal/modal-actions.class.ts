import { Component, Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState } from '../state.interface';
//import {ModalService} from "./modal.service";


@Injectable()
export class ModalActions {
  private static prefix = 'CA_MODAL_';
  static MODAL_OPEN = ModalActions.prefix + 'MODAL_OPEN';
//  static MODAL_HIDE = ModalActions.prefix + 'MODAL_HIDE';
  static MODAL_RESOLVE = ModalActions.prefix + 'MODAL_RESOLVE';

  constructor(private ngRedux: NgRedux<IAppState>) {} //, private modalService:ModalService

  open(component:Component, params:any={}):void {
  //  this.modalService.component  = component; // A fly in the ointment.  Revisit this apporach
    // Can I stick the component on the action?
    this.ngRedux.dispatch({ type: ModalActions.MODAL_OPEN, payload: {params}});

  }

//  hide():void {
//    this.ngRedux.dispatch({ type: ModalActions.MODAL_HIDE});
//  }

  resolve(result:any):void {
    this.ngRedux.dispatch({ type: ModalActions.MODAL_RESOLVE, payload: {result}});
  }

}