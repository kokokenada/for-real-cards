
import { makeTypedFactory } from 'typed-immutable-record';


import { IPayloadAction } from '../action.interface';
import { LoginActions } from './login-actions.class';
import {ILoginState, ILoginRecord, ILoginAction} from './login.types'
import {LoginService} from "./login.service";


export const ConnectFactory = makeTypedFactory<ILoginState, ILoginRecord>({
  loggedIn: false,
  loggingIn: false,
  userId: null,
  displayName: null,
  user: undefined
});

export const INITIAL_STATE = ConnectFactory();


export function loginReducer(
  state: ILoginRecord = INITIAL_STATE,
  action: IPayloadAction): ILoginRecord {

  let payload:ILoginAction = action.payload;
  switch (action.type) {
    case LoginActions.LOGIN_REQUEST:
      return state.merge({
        loggingIn: true
      });
    case LoginActions.LOGGED_IN:
      return state.merge({
        loggingIn: false,
        loggedIn: true,
        userId: action.payload.user._id,
        displayName: LoginService.getDisplayNameNoLookup(action.payload.user),  // OK because it's synchronous
        user: action.payload.user
      });
    case LoginActions.LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
}

