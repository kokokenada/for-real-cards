import { ReduxPackage, IAppState, IPayloadAction } from 'redux-package';
import { usersReducer } from "./users-reducer";
import { UsersAsync } from "./users-async";
import { UsersActions } from "./users-actions";
import { IUsersService } from './users-service-interface';

export let USERS_PACKAGE_NAME = 'common-app-users';

/**
 * Watches a group of users and notifies of changes
 */
export class UsersPackage extends ReduxPackage<IAppState, IPayloadAction >  {
  reducers=[{name: USERS_PACKAGE_NAME, reducer: usersReducer}];
  actions = UsersActions;
  constructor(private service: IUsersService) {
    super();
    let async = new UsersAsync(this.service);
    this.epics.push(async.watchUsers);
  }

  initialize():void {
    this.actions.watch();
  }
}