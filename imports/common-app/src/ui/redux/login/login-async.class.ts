import { Injectable } from '@angular/core';
import { IPayloadAction  } from '../action.interface';
import { Observable } from 'rxjs/Observable';
import { Action } from "redux";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
//import 'rxjs/add/observable/delay';

import { LoginActions } from "./login-actions.class";
import {LoginService} from "./login.service";
import {NeverObservableAction} from "../neverObservableAction.class";

@Injectable()
export class LoginAsync {
  constructor(private loginActions: LoginActions) {}

  checkAutoLogin = (action$: Observable<IPayloadAction>):Observable<Action> => {
    let loginActions:LoginActions = this.loginActions;
    return action$
      .filter(({type}) => {
        return type === LoginActions.CHECK_AUTO_LOGIN
      })
      .flatMap(({payload}) => {
        if (LoginService.isLoggedIn()) {
          // Yes, we're logged in, so fire off a logged in event
          return Observable.from([LoginActions.loginSuccessFactory(LoginService.user())]);
        }
        return new NeverObservableAction();
      });
  };

  login = (action$: Observable<IPayloadAction>) => {
    return action$
      .filter(({ type }) => type === LoginActions.LOGIN_REQUEST)
      .flatMap(({ payload }) => {
        return Observable.fromPromise(
          LoginService.login(payload.credentials)
        ).catch(error => Observable.of(error));
      });
  };

  logout = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === LoginActions.LOGOUT_REQUEST)
      .flatMap(({ payload }) => {
        return Observable.fromPromise(
          LoginService.logOut()
        ).catch(error => Observable.of(error));
      });
  };

  readUser = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === LoginActions.READ_CUR_USER_REQUEST)
      .flatMap(({ payload }) => {
        return Observable.fromPromise(
          LoginService.readCurrentUser()
        ).catch(error => Observable.of(error));
      });
  };

  saveUser = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === LoginActions.SAVE_USER_RESPONSE)
      .flatMap(({ payload }) => {
        return Observable.fromPromise(
          LoginService.saveUser(payload.user)
        ).catch(error => Observable.of(error));
      });
  };
}
