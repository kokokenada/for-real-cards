import { Injectable } from '@angular/core';
import { IPayloadAction  } from '../action.interface';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from "redux";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
//import 'rxjs/add/observable/delay';

import { LoginActions } from "./login-actions.class";
import {IAppState} from "../state.interface";
import {ILoginState} from "./login.types";
import {LoginService} from "./login.service";
import {Credentials} from "../../services/credentials";
import {User} from "../../../../../common-app-api/src/api/models/user.model";
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
        console.log("login check")
        if (LoginService.isLoggedIn()) {
          console.log(LoginService.user());
          // Yes, we're logged in, so fire off a logged in event
          return Observable.from([LoginActions.loginSuccessFactory(LoginService.user())]);
        }
        console.log("not logged in");
        return new NeverObservableAction();
      });
  };

  login = (action$: Observable<IPayloadAction>) => {
    return action$
      .filter(({ type }) => type === LoginActions.LOGIN_REQUEST)
      .flatMap(({ payload }) => {
        console.log("login request. payload:")
        console.log(payload);
        return Observable.fromPromise(
          LoginService.login(payload.credentials)
        )
      })
      .catch(error => Observable.of(error));
  };

  logout = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === LoginActions.LOGOUT_REQUEST)
      .flatMap(({ payload }) => {
        console.log("logout request. ")
        return Observable.fromPromise(
          LoginService.logOut()
        )
      });
  };
}
