
import { IPayloadAction } from '../action.interface';
import { LoginActions } from './login-actions.class';
import {ILoginState, ILoginAction} from './login.types'
import {User} from "../../../../../common-app-api";

export const LOGIN_INITIAL_STATE:ILoginState = {
  neverLoggedIn: true,
  loggedIn: false,
  loggingIn: false,
  userId: null,
  displayName: null,
  user: null,
  errorMessage: ''
};

export function loginReducer(
  state: ILoginState = LOGIN_INITIAL_STATE,
  action: IPayloadAction): ILoginState {

  let payload:ILoginAction = action.payload;
  switch (action.type) {
    case LoginActions.LOGIN_REQUEST:
      return Object.assign({}, state, {loggingIn: true});
    case LoginActions.LOGGED_IN:
      return {
        neverLoggedIn:false,
        loggingIn: false,
        loggedIn: true,
        userId: action.payload.user ? action.payload.user._id : (action.payload.userId ? action.payload.userId : state.userId),
        displayName: User.getDisplayName(action.payload.user),  // OK because it's synchronous
        user: action.payload.user,
        errorMessage: ''
      };
    case LoginActions.LOGGED_OUT:
      return Object.assign({}, state, {
        loggedIn: false,
        loggingIn: false,
        userId: null,
        displayName: null,
        user: null,
        errorMessage: ''
      });
    case LoginActions.LOGIN_ERROR:
      return Object.assign({}, state,
        {
          loggingIn: false,
          loggedIn: false,
          userId: '',
          displayName: '',
          user: null,
          errorMessage: action.error.message
        }
      );
    case LoginActions.SAVE_USER_RESPONSE:   // Fall through
    case LoginActions.READ_CUR_USER_RESPONSE:
      return Object.assign({}, state, {user: payload.user});
    case LoginActions.WATCHED_USER_CHANGED:
      return Object.assign({}, state, {user: payload.documentChange.newDocument});
    default:
      return state;
  }
}

