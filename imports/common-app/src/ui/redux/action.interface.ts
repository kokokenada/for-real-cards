
import { Action } from 'redux';
import { ConnectActions } from './connect/connect-actions.class';

export interface IAction extends IPayloadAction {
  type: string;
  error?:boolean;
  meta?:any;
}


export interface IPayloadAction extends Action {
  payload?: any;
}

export const ACTION_PROVIDERS = [ ConnectActions ];
export { ConnectActions };
