import {Injectable} from "@angular/core";

import { ReduxPackage, IAppState, IPayloadAction } from 'redux-package';
import { loginReducer } from "./login-reducer";
import { LoginAsync } from "./login-async.class";
import { LoginActions } from "./login-actions.class";

@Injectable()
export class LoginModule extends ReduxPackage<IAppState, IPayloadAction>  {
  reducers=[{name:'loginReducer', reducer:loginReducer}];
  action = LoginActions;
  constructor(private loginEpics:LoginAsync) {
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
}