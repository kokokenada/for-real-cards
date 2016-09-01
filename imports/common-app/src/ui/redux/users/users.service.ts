
import { Meteor } from 'meteor/meteor';
import {Observable, Subscription} from 'rxjs';

import {User} from "../../../../../common-app-api/";
import {MeteorCursorObservers} from "../../reactive-data/meteor-cursor-observers";
import {IDocumentChange, EDocumentChangeType} from "../../reactive-data/document-change.interface";
import {UsersActions} from "./users-actions.class";

export class UsersService {
  private static userCursor:Mongo.Cursor<User>;

  static createUsersObserver():Observable<IDocumentChange<User>>
  {
    return MeteorCursorObservers.createCursorObserver<User>(Meteor.users.find());
  }
}
