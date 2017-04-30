import {Injectable} from "@angular/core";

import { ReduxPackage, IAppState, IPayloadAction} from 'redux-package';
import { connectReducer } from "./connect-reducer";
import { ConnectAsync } from "./connect-async.class";
import { ConnectActions } from "./connect-actions.class";

@Injectable()
export class ConnectModule extends ReduxPackage<IAppState, IPayloadAction>  {
  reducers=[{name:'connectReducer', reducer:connectReducer}];
  actions = ConnectActions;
  constructor(private connectEpics:ConnectAsync) {
    super();
    this.epics.push(
      connectEpics.attempt,
      connectEpics.connect,
      connectEpics.setNewServer
    );
  }
}