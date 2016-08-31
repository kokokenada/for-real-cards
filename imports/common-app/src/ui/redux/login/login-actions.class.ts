import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState } from '../state.interface';
import { IPayloadAction} from "../action.interface";
import {Credentials} from "../../services/credentials";
import {User} from "../../../../../common-app-api";

@Injectable()
export class LoginActions {
  private static prefix = 'CA_LOGIN_';
  static CHECK_AUTO_LOGIN = LoginActions.prefix + 'CHECK_AUTO_LOGIN';
  static LOGIN_REQUEST = LoginActions.prefix + 'LOGIN_REQUEST';
  static REGISTRATION_REQUEST = LoginActions.prefix + 'REG_REQUEST';
  static TEMP_USER_REQUEST = LoginActions.prefix + 'TEMP_USER_REQUEST';
  static LOGGED_IN = LoginActions.prefix + 'LOGGED_IN';
  static LOGOUT_REQUEST = LoginActions.prefix + 'LOGOUT_REQUEST';
  static LOGGED_OUT = LoginActions.prefix + 'LOGGED_OUT';
  static LOGIN_ERROR = LoginActions.prefix + 'LOGIN_ERROR';
  static READ_CUR_USER_REQUEST = LoginActions.prefix + 'READ_USER_REQ';
  static READ_CUR_USER_RESPONSE = LoginActions.prefix + 'READ_USER_RESP';
  static SAVE_USER_REQUEST = LoginActions.prefix + 'SAVE_USER_REQ';
  static SAVE_USER_RESPONSE = LoginActions.prefix + ' SAVE_USER_RESP';
  static AVATAR_UPDATE = LoginActions.prefix + 'AVATAR_UPDATE';
  static DISPLAY_NAME_UPDATE = LoginActions + 'DISPLAY_NAME_UPDATE';
  static ROLL_UPDATE = LoginActions + 'ROLL_UPDATE';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  checkAutoLogin() : void {
    this.ngRedux.dispatch({ type: LoginActions.CHECK_AUTO_LOGIN});
  }

  login(credentials:Credentials):void {
    this.ngRedux.dispatch({ type: LoginActions.LOGIN_REQUEST, payload: {credentials: credentials}});
  }

  logout():void {
    this.ngRedux.dispatch({ type: LoginActions.LOGOUT_REQUEST});
  }

  register(credentials:Credentials):void {
    this.ngRedux.dispatch({ type: LoginActions.REGISTRATION_REQUEST, payload: {credentials: credentials}});
  }

  loginAsTemporaryUser():void {
    this.ngRedux.dispatch({ type: LoginActions.TEMP_USER_REQUEST});
  }

  readCurrrentUser(): void {
    this.ngRedux.dispatch({type: LoginActions.READ_CUR_USER_REQUEST});
  }

  saveUser(user:User): void {
    this.ngRedux.dispatch({type: LoginActions.SAVE_USER_REQUEST, payload: {user: user}});
  }

  static readCurUserResponseFactory(user:User):IPayloadAction {
    return {type: LoginActions.READ_CUR_USER_RESPONSE, payload: {user: user}};
  }

  static saveUserResponseFactory(user:User):IPayloadAction {
    return {type: LoginActions.SAVE_USER_RESPONSE, payload: {user: user}};
  }

  static loginSuccessFactory(user:User):IPayloadAction {
    return {type: LoginActions.LOGGED_IN, payload: {user: user}};
  }

  static logedOutFactory():IPayloadAction {
    return {type: LoginActions.LOGGED_OUT};
  }
}