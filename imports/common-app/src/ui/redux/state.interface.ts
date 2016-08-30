import {IConnectState} from './connect/connect.types';
import {ILoginState} from "./login/login.types";

export interface IAppState {
  connect?: IConnectState;
  login?: ILoginState
}
