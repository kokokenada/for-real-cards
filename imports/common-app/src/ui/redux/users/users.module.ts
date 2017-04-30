import {Injectable} from "@angular/core";
import { ReduxPackage, IAppState, IPayloadAction } from 'redux-package';
import { usersReducer } from "./users-reducer";
import { UsersAsync } from "./users-async.class";
import { UsersActions } from "./users-actions.class";

@Injectable()
/**
 * Watches a group of users and notifies of changes
 */
export class UsersModule extends ReduxPackage<IAppState, IPayloadAction >  {
  reducers=[{name: 'usersReducer', reducer: usersReducer}];
  actions = UsersActions;
  constructor(private usersEpics:UsersAsync) {
    super();
    this.epics.push(usersEpics.watchUsers);
  }

  initialize():void {
    this.actions.watch();
  }
}