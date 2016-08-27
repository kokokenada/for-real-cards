
import { Action } from 'redux';
import { ConnectActions } from './connect/connect-actions';

export interface IAction extends Action {
  type: string;
  payload?:any;
  error?:boolean;
  meta?:any;
}


export interface IPayloadAction extends Action {
  payload?: any;
}

export const ACTION_PROVIDERS = [ ConnectActions ];
export { ConnectActions };
