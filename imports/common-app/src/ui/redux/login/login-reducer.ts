
import { IPayloadAction } from '../action.interface';
import { LoginActions } from './login-actions.class';
import {ILoginState, ILoginAction} from './login.types'
import {LoginService} from "./login.service";

const INITIAL_STATE = {
  loggedIn: false,
  loggingIn: false,
  userId: null,
  displayName: null,
  user: null,
  errorMessage: ''
};

export function loginReducer(
  state: ILoginState = INITIAL_STATE,
  action: IPayloadAction): ILoginState {

  let payload:ILoginAction = action.payload;
  switch (action.type) {
    case LoginActions.LOGIN_REQUEST:
      return Object.assign(state, {loggingIn: true});
    case LoginActions.LOGGED_IN:
      return {
        loggingIn: false,
        loggedIn: true,
        userId: action.payload.user._id,
        displayName: LoginService.getDisplayNameNoLookup(action.payload.user),  // OK because it's synchronous
        user: action.payload.user,
        errorMessage: ''
      };
    case LoginActions.LOGGED_OUT:
      return INITIAL_STATE;
    case LoginActions.LOGIN_ERROR:
      return {
        loggingIn: false,
        loggedIn: false,
        userId: '',
        displayName: '',
        user: null,
        errorMessage: action.error.message
      };
    default:
      return state;
  }
}

