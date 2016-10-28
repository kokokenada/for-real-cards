import {Injectable} from "@angular/core";

import { ReduxModule } from '../redux-module.class';
import { loginReducer } from "./login-reducer";
import { LoginAsync } from "./login-async.class";
import { IAppState } from "../state.interface";
import { IPayloadAction } from "../action.interface";
import { LoginActions } from "./login-actions.class";

@Injectable()
export class LoginModule extends ReduxModule<IAppState, IPayloadAction>  {
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

  initialize():void {}
}