import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import {loginReducer} from "./login-reducer";
import {LoginAsync} from "./login-async.class";
import {IAppState} from "../state.interface";
import {LoginActions} from "./login-actions.class";

@Injectable()
export class LoginModule extends ReduxModule<IAppState>  {
  reducer=loginReducer;

  constructor(private loginEpics:LoginAsync, public actions:LoginActions) {
    super();
    this.epics.push(loginEpics.checkAutoLogin);
    this.epics.push(loginEpics.login);
    this.epics.push(loginEpics.logout);
  }
}