import { Component, Injectable } from '@angular/core';
import { ReduxPackageCombiner } from "redux-package";

export class ModalActions {
  private static prefix = 'CA_MODAL_';
  static MODAL_OPEN_REQUEST = ModalActions.prefix + 'MODAL_OPEN_REQUEST';
  static MODAL_OPEN_SUCCESS = ModalActions.prefix + 'MODAL_OPEN_SUCCESS';
//  static MODAL_HIDE = ModalActions.prefix + 'MODAL_HIDE';
  static MODAL_RESOLVE_REQUEST = ModalActions.prefix + 'MODAL_RESOLVE_REQUEST';
  static MODAL_RESOLVE_SUCCESS = ModalActions.prefix + 'MODAL_RESOLVE_SUCCESS';

  static openRequest(component:Component, params:any={}):void {
    ReduxPackageCombiner.dispatch({ type: ModalActions.MODAL_OPEN_REQUEST, payload: {component, params}});
  }

  static openSuccess():void {
    ReduxPackageCombiner.dispatch({ type: ModalActions.MODAL_OPEN_SUCCESS});
  }

//  hide():void {
//    this.ngRedux.dispatch({ type: ModalActions.MODAL_HIDE});
//  }

  static resolveRequest(result:any):void {
    ReduxPackageCombiner.dispatch({ type: ModalActions.MODAL_RESOLVE_REQUEST, payload: {result}});
  }

  static resolveSuccess():void {
    ReduxPackageCombiner.dispatch({ type: ModalActions.MODAL_RESOLVE_SUCCESS});
  }

}