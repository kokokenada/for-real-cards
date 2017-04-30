import { IAppState } from 'redux-package';
import { ILoginState } from './login/login.types';

export interface IAppStateCommonApp extends IAppState {
  loginReducer: ILoginState;
}