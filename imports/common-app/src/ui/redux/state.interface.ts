import {IConnectState} from './connect/connect.types';
import {ILoginState} from "./login/login.types";

export interface IAppState {
  connectReducer?: IConnectState;
  loginReducer?: ILoginState
}
