import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import {connectReducer} from "./connect-reducer";
import {ConnectAsync} from "./connect-async.class";
import {IAppState} from "../state.interface";
import {ConnectActions} from "./connect-actions.class";

@Injectable()
export class ConnectModule extends ReduxModule<IAppState>  {
  reducer=connectReducer;

  constructor(private connectEpics:ConnectAsync, public actions:ConnectActions) {
    super();
    this.epics.push(connectEpics.attempt);
    this.epics.push(connectEpics.connect);
    this.epics.push(connectEpics.setNewServer);
  }

  initialize():void {

  }
}