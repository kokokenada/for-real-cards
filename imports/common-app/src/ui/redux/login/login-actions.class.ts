import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState } from '../state.interface';
import { IPayloadAction} from "../action.interface";
import {Credentials} from "../../services/credentials";
import {User} from "../../../../../common-app-api/src/api/models/user.model";

@Injectable()
export class LoginActions {
  private static prefix = 'CA_USER_';
  static CHECK_AUTO_LOGIN = LoginActions.prefix + 'CHECK_AUTO_LOGIN';
  static LOGIN_REQUEST = LoginActions.prefix + 'LOGIN';
  static LOGGED_IN = LoginActions.prefix + 'LOGIN';
  static LOG_OUT_REQUEST = LoginActions.prefix + 'LOG_OUT_REQUEST';
  static LOGOUT = LoginActions.prefix + 'LOGOUT';
  static AVATAR_UPDATE = LoginActions.prefix + 'AVATAR_UPDATE';
  static DISPLAY_NAME_UPDATE = LoginActions + 'DISPLAY_NAME_UPDATE';
  static ROLL_UPDATE = LoginActions + 'ROLL_UPDATE';

  // static CONNECT_AUTOLOGIN = ConnectActions.prefix + 'AUTO_LOGIN';  // Move to Login module

  constructor(private ngRedux: NgRedux<IAppState>) {}

  checkAutoLogin() : void {
    this.ngRedux.dispatch({ type: LoginActions.CHECK_AUTO_LOGIN});
  }

  login(credentials:Credentials):void {
    this.ngRedux.dispatch({ type: LoginActions.LOGIN_REQUEST, payload: {credentials: credentials}});
  }

  loginSuccessFactory(user:User):IPayloadAction {
    return {type: LoginActions.LOGGED_IN, payload: {user: user}};
  }
}