import {Injectable} from "@angular/core";

import { ReduxModule } from '../redux-module.class';
import { usersReducer } from "./users-reducer";
import { UsersAsync } from "./users-async.class";
import { IAppState } from "../state.interface";
import { UsersActions } from "./users-actions.class";

@Injectable()
/**
 * Watches a group of users and notifies of changes
 */
export class UsersModule extends ReduxModule<IAppState>  {
  reducer={name: 'usersReducer', reducer: usersReducer};

  constructor(private usersEpics:UsersAsync, public actions:UsersActions) {
    super();
    this.epics.push(usersEpics.watchUsers);
  }

  initialize():void {
    this.actions.watch();
  }
}