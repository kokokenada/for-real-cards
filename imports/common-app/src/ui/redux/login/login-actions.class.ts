import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';

import { User } from "../../../../../common-app-api/src/api/models/user.model";
import { IDocumentChange } from "../../reactive-data/document-change.interface";
import { IAppState } from '../state.interface';
import { IPayloadAction } from "../action.interface";
import { Credentials } from "../../services/credentials";

@Injectable()
export class LoginActions {
  private static prefix = 'CA_LOGIN_';
  static LOGIN_REQUEST = LoginActions.prefix + 'LOGIN_REQUEST';
  static REGISTRATION_REQUEST = LoginActions.prefix + 'REG_REQUEST';
  static TEMP_USER_REQUEST = LoginActions.prefix + 'TEMP_USER_REQUEST';
  static LOGGED_IN = LoginActions.prefix + 'LOGGED_IN';
  static LOGIN_ERROR = LoginActions.prefix + 'LOGIN_ERROR';

  static LOGOUT_REQUEST = LoginActions.prefix + 'LOGOUT_REQUEST';
  static LOGGED_OUT = LoginActions.prefix + 'LOGGED_OUT';

  static SAVE_USER_REQUEST = LoginActions.prefix + 'SAVE_USER_REQ';
  static SAVE_USER_RESPONSE = LoginActions.prefix + 'SAVE_USER_RESP';

  static WATCH_USER = LoginActions.prefix + 'WATCH_USER';
  static WATCH_USER_FIRST_READ = LoginActions.prefix + 'WATCHED_USER_FIRST_READ';
  static WATCHED_USER_CHANGED = LoginActions.prefix + 'WATCHED_USER_CHANGED';

  constructor(private ngRedux: NgRedux<IAppState>) {}

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

  saveUser(user:User): void {
    this.ngRedux.dispatch({type: LoginActions.SAVE_USER_REQUEST, payload: {user: user}});
  }

  watchUser() : void {
    this.ngRedux.dispatch({type: LoginActions.WATCH_USER});
  }

  static watchedUserFirstReadFactory(user:User):IPayloadAction {
    return {type: LoginActions.WATCH_USER_FIRST_READ, payload: {user: user}};
  }

  static saveUserResponseFactory(user:User):IPayloadAction {
    return {type: LoginActions.SAVE_USER_RESPONSE, payload: {user: user}};
  }

  static loginSuccessFactory(user:User, userId:string, autoLogin:boolean=false):IPayloadAction {
    return {type: LoginActions.LOGGED_IN, payload: {user: user, userId:userId, autoLogin:autoLogin}};
  }

  static loggedOutFactory():IPayloadAction {
    return {type: LoginActions.LOGGED_OUT};
  }

  static changeFactory(documentChange:IDocumentChange<User>):IPayloadAction {
    return {type: LoginActions.WATCHED_USER_CHANGED, payload: {documentChange:documentChange}};
  }
}