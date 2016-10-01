import { Component, Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState } from '../state.interface';


@Injectable()
export class ModalActions {
  private static prefix = 'CA_MODAL_';
  static MODAL_OPEN_REQUEST = ModalActions.prefix + 'MODAL_OPEN_REQUEST';
  static MODAL_OPEN_SUCCESS = ModalActions.prefix + 'MODAL_OPEN_SUCCESS';
//  static MODAL_HIDE = ModalActions.prefix + 'MODAL_HIDE';
  static MODAL_RESOLVE_REQUEST = ModalActions.prefix + 'MODAL_RESOLVE_REQUEST';
  static MODAL_RESOLVE_SUCCESS = ModalActions.prefix + 'MODAL_RESOLVE_SUCCESS';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  openRequest(component:Component, params:any={}):void {
    this.ngRedux.dispatch({ type: ModalActions.MODAL_OPEN_REQUEST, payload: {component, params}});
  }

  openSuccess():void {
    this.ngRedux.dispatch({ type: ModalActions.MODAL_OPEN_SUCCESS});
  }

//  hide():void {
//    this.ngRedux.dispatch({ type: ModalActions.MODAL_HIDE});
//  }

  resolveRequest(result:any):void {
    this.ngRedux.dispatch({ type: ModalActions.MODAL_RESOLVE_REQUEST, payload: {result}});
  }

  resolveSuccess():void {
    this.ngRedux.dispatch({ type: ModalActions.MODAL_RESOLVE_SUCCESS});
  }

}