import { Component, Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState } from '../state.interface';


@Injectable()
export class ModalActions {
  private static prefix = 'CA_MODAL_';
  static MODAL_OPEN = ModalActions.prefix + 'MODAL_OPEN';
//  static MODAL_HIDE = ModalActions.prefix + 'MODAL_HIDE';
  static MODAL_RESOLVE = ModalActions.prefix + 'MODAL_RESOLVE';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  open(compoent:Component, params:any={}):void {
    this.ngRedux.dispatch({ type: ModalActions.MODAL_OPEN, payload: {params}});
  }

//  hide():void {
//    this.ngRedux.dispatch({ type: ModalActions.MODAL_HIDE});
//  }

  resolve(result:any):void {
    this.ngRedux.dispatch({ type: ModalActions.MODAL_RESOLVE, payload: {result}});
  }

}