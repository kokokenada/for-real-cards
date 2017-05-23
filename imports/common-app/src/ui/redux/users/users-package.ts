import {ReduxPackage, IAppState, IPayloadAction, ReduxPackageCombiner} from 'redux-package';
import { usersReducer } from "./users-reducer";
import { UsersAsync } from "./users-async";
import { UsersActions } from "./users-actions";
import { IUsersService } from './users-service-interface';
import {IUsersState} from './users-types';

export let USERS_PACKAGE_NAME = 'common-app-users';

/**
 * Watches a group of users and notifies of changes
 */
export class UsersPackage extends ReduxPackage<IAppState, IPayloadAction >  {
  static watchedUsers: IUsersState;
  reducers=[{name: USERS_PACKAGE_NAME, reducer: usersReducer}];
  actions = UsersActions;
  constructor(private service: IUsersService) {
    super();
    let async = new UsersAsync(this.service);
    this.epics.push(async.watchUsers);
  }

  initialize():void {
    this.actions.watch();
    ReduxPackageCombiner.select(USERS_PACKAGE_NAME).subscribe( (newState: IUsersState) => {
      UsersPackage.watchedUsers = newState;
    });
  }
}