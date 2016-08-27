import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import {connectReducer} from "./connect-reducer";
import {ConnectEpics} from "./connect-async";

@Injectable()
export class ConnectModule extends ReduxModule  {
  reducer=connectReducer;

  constructor(private connectEpics:ConnectEpics) {
    super();
    super.epics.push(connectEpics.attempt);
    super.epics.push(connectEpics.connect);
    super.epics.push(connectEpics.setNewServer);
  }
}