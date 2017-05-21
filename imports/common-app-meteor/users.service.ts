
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';

import { IUser, IDocumentChange } from 'common-app';
import { MeteorCursorObservers } from './';
import {IUsersService} from '../common-app/src/ui/redux/users/users-service-interface';

export class UsersServiceMeteor implements IUsersService {
  private static userCursor:Mongo.Cursor<IUser>;

  createUsersObserver():Observable<IDocumentChange<IUser>>
  {
    return MeteorCursorObservers.fromMeteorCursor<IUser>(Meteor.users.find()); // Depends on subscription being called elsewhere
  }
}
