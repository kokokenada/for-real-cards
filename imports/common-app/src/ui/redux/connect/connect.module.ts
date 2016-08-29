import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import {connectReducer} from "./connect-reducer";
import {ConnectAsync} from "./connect-async.class";
import {IAppState} from "../state.interface";

@Injectable()
export class ConnectModule extends ReduxModule<IAppState>  {
  reducer=connectReducer;

  constructor(private connectEpics:ConnectAsync) {
    super();
    this.epics.push(connectEpics.attempt);
    this.epics.push(connectEpics.connect);
    this.epics.push(connectEpics.setNewServer);
  }
}