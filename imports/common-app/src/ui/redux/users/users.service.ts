
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';

import { IUser, IDocumentChange } from 'common-app';
import { MeteorCursorObservers } from '../../../../../common-app-meteor';

export class UsersService {
  private static userCursor:Mongo.Cursor<IUser>;

  static createUsersObserver():Observable<IDocumentChange<IUser>>
  {
    return MeteorCursorObservers.fromMeteorCursor<IUser>(Meteor.users.find()); // Depends on subscription being called elsewhere
  }
}
