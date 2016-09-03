import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState } from '../state.interface';
import { IPayloadAction} from "../action.interface";

@Injectable()
export class ConnectActions {
  private static prefix = 'CA_CONNECT_';
  static CONNECT_START = ConnectActions.prefix + 'START';       // Start connection sequence
  static CONNECT_ATTEMPT = ConnectActions.prefix + 'ATTEMPT';   // An inidivual connection attempt
  static CONNECT_SUCCESS = ConnectActions.prefix + 'SUCCESS';
  static CONNECT_FAIL = ConnectActions.prefix + 'FAIL';
  static CONNECT_SET_SERVER = ConnectActions.prefix + 'SET_SERVER';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  checkConnection():void {
    this.ngRedux.dispatch({ type: ConnectActions.CONNECT_START});
  }
  attemptFactory(serverURL:string):IPayloadAction {
    return {type: ConnectActions.CONNECT_ATTEMPT, payload: {serverURL: serverURL}};
  }
  successFactory(serverURL:string):IPayloadAction {
    return {type: ConnectActions.CONNECT_SUCCESS, payload: {serverURL: serverURL}};
  }
  setServerURL(serverURL:string):void {
    this.ngRedux.dispatch({ type: ConnectActions.CONNECT_SET_SERVER, payload: {serverURL: serverURL}});
  }

}