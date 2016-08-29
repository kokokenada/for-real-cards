import { Injectable } from '@angular/core';
import { IPayloadAction  } from '../action.interface';
import { Observable } from 'rxjs/Observable';
import { Store } from "redux";
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


@Injectable()
export class LoginAsync {
  constructor(private loginActions: LoginActions) {}

  checkAutoLogin(action$: Observable<IPayloadAction>) {
    return action$.filter(({type}) => type === LoginActions.CHECK_AUTO_LOGIN)
      .flatMap(({payload}) => {
        console.log("login check")
        if (LoginService.isLoggedIn()) {
          // Yes, we're logged in to fire off a logged in event
          return Observable.from([this.loginActions.loginSuccessFactory(LoginService.user())])
        }
      });
  }


  login (action$: Observable<IPayloadAction>) {
    return action$.filter(({ type }) => type === LoginActions.LOGIN_REQUEST)
      .flatMap(({ payload }) => {
        console.log("login request. payload:")
        console.log(payload);
        return Observable.fromPromise(
          LoginService.login(payload.credentials)
        )
      });
  }
}
