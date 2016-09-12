import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import {loginReducer} from "./login-reducer";
import {LoginAsync} from "./login-async.class";
import {IAppState} from "../state.interface";
import {LoginActions} from "./login-actions.class";

@Injectable()
export class LoginModule extends ReduxModule<IAppState>  {
  reducer={name:'loginReducer', reducer:loginReducer};

  constructor(private loginEpics:LoginAsync, public actions:LoginActions) {
    super();
    this.epics.push(
      loginEpics.login,
      loginEpics.register,
      loginEpics.tempUser,
      loginEpics.logout,
      loginEpics.watchUser,
      loginEpics.saveUser
    );
  }

  initialize():void {}
}