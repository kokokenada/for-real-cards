
import { makeTypedFactory } from 'typed-immutable-record';

import { IPayloadAction } from '../action.interface';
import { ConnectActions } from './connect-actions.class';
import {IConnectState, IConnectRecord, IConnectActionPayload} from './connect.types'


export const ConnectFactory = makeTypedFactory<IConnectState, IConnectRecord>({
  connected: false,
  connecting: false,
  retryCount: 0,
  serverURL: ""
});

export const INITIAL_STATE = ConnectFactory();


export function connectReducer(
  state: IConnectRecord = INITIAL_STATE,
  action: IPayloadAction): IConnectRecord {

  let payload:IConnectActionPayload = action.payload;
  switch (action.type) {
    case ConnectActions.CONNECT_START:
      return state.merge({
        connecting: true
      });
    case ConnectActions.CONNECT_SUCCESS:
      return state.merge({
        connecting: false,
        connected: true,
        serverURL: action.payload.serverURL,
        retryCount: 0
      });
    case ConnectActions.CONNECT_ATTEMPT:
      return state.update('retryCount', (value) => value + 1);
    case ConnectActions.CONNECT_FAIL:
      return state.set('connected', false);
    case ConnectActions.CONNECT_SET_SERVER:
      return state.set('connected', false);
    default:
      return state;
  }
}

