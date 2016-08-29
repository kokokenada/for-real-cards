import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import {loginReducer} from "./login-reducer";
import {LoginAsync} from "./login-async.class";
import {IAppState} from "../state.interface";

@Injectable()
export class LoginModule extends ReduxModule<IAppState>  {
  reducer=loginReducer;

  constructor(private loginEpics:LoginAsync) {
    super();
    this.epics.push(loginEpics.checkAutoLogin);
    this.epics.push(loginEpics.login);
  }
}