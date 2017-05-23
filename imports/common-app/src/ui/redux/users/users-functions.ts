import {IUsersState} from './users-types';
import {UsersPackage} from './users-package';
import {IUser, LoginFunctions} from 'common-app';

export class UsersFunctions {
  static displayName(userId, state:IUsersState = UsersPackage.watchedUsers): string {
    let user: IUser = state.users.get(userId);
    if (user)
      return LoginFunctions.getDisplayName(user)
    return userId;
  }
}