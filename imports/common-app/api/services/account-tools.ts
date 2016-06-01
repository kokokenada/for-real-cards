import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import {Observable, Subject, Subscription} from 'rxjs'
import * as log from 'loglevel';

import {User} from '../models/user.model';
import {Tools} from "./tools"
import {Credentials} from "./credentials";
import {UserEvent, UserEventType} from "../models/user-event.class";

export class AccountTools {
  static editUserObject:any;
  
  static login(credentials:Credentials):Observable {
    log.debug('Logging in');
    let observable:Observable = Observable.create(observer=> {
      credentials.saveCredentials();
      log.debug('Credentials:' + JSON.stringify(credentials) );
      Meteor.loginWithPassword(
        credentials.email ? credentials.email : credentials.username, credentials.password,
        (error)=> {
          if (error) {
            log.error(error);
            observer.error(error);
          } else {
            log.info('Login successful.');
            UserEvent.pushEvent(new UserEvent(UserEventType.LOGIN, {userId: Meteor.userId()}));
            observer.next(Meteor.user());
            observer.complete();
          }
        });
    });
    return observable;
  }

  static register(credentials:Credentials):Observable {
    let observable:Observable = Observable.create(observer=> {
      credentials.saveCredentials();
      Accounts.createUser({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        profile: {
          createdOn: new Date()
        }
      }, (error)=> {
        if (error) {
          log.error(error);
          observer.error(error);
        } else {
          UserEvent.pushEvent(new UserEvent(UserEventType.LOGIN, {userId: Meteor.userId()}));
          observer.next(Meteor.user());
          observer.complete();
        }
      })
    });
    return observable;
  };

  static createTempUser():Observable {
    let observable:Observable = Observable.create(observer=> {
      Meteor.call('CommonGetNextSequence', 'temp_user', (error, result)=> {
        if (error) {
          observer.onError(error);
        } else {
          let userId = 'tmp_' + result.toString();
          let credentials:Credentials = new Credentials(
            "",
            userId,
            Math.random().toString()
          );
          AccountTools.register(credentials).subscribe(
            (user) => {
              UserEvent.pushEvent(new UserEvent(UserEventType.LOGIN, {userId: Meteor.userId()}));
              observer.next(user);
              observer.complete();
            }, (error)=> {
              observer.error(error);
            }
          );
        }
      });
    });
    return observable;
  }

  static saveCurrentUser():Observable {
    let observable:Observable = Observable.create(observer=> {
      Meteor.call('commonUpdateUser',
        AccountTools.editUserObject,
        function (error, numberAffected:number) {
          if (error) {
            log.error(error);
            observer.error(error);
          } else {
            if (numberAffected === 1) {
              observer.next(AccountTools.editUserObject);
              observer.complete();
              UserEvent.pushDisplayNameValue(Meteor.user());
            } else {
              let errorDescription:string = 'Unexpected number of records affected. (' + numberAffected + ')';
              log.error(errorDescription);
              observer.error(new Meteor.Error('error-updating-user', errorDescription));
            }
          }
        }
      );
    });
    return observable;
  }

  static logOut():void {
    Meteor.logout();
    UserEvent.pushEvent(new UserEvent(UserEventType.LOGOUT));
  };
  
  static readCurrentUser() {
    // Initialize
    Meteor.subscribe('user-edit', {reactive: false}, {
      onReady: ()=> {
        AccountTools.editUserObject = Tools.deepCopy(Meteor.user()); // Copy Current User
      },
      onStop: (error)=> {
        if (error) {
          log.error(error);
          throw error;
        }
      }
    });
  }

/* CollectionFS Related
  static getToken(options = undefined) // reference https://github.com/CollectionFS/Meteor-CollectionFS/blob/b46cb20d2d86a806e19e9ffbd72955c2a4ae37e7/packages/access-point/access-point-common.js#L64
  {
    options = options || {};
    let authToken = "";
    if (Meteor.isClient && typeof Accounts !== "undefined" && typeof Accounts._storedLoginToken === "function") {
      if (options.auth !== false) {
        // Add reactive deps on the user
        Meteor.userId();

        var authObject = {
          authToken: Accounts._storedLoginToken() || ''
        };

        // If it's a number, we use that as the expiration time (in seconds)
        if (options.auth === +options.auth) {
          authObject.expiration = FS.HTTP.now() + options.auth * 1000;
        }

        // Set the authToken
        var authString = JSON.stringify(authObject);
        authToken = FS.Utility.btoa(authString);
      }
    } else if (typeof options.auth === "string") {
      // If the user supplies auth token the user will be responsible for
      // updating
      authToken = options.auth;
    }
    return authToken;
  }
  */
  
  private static _user(userId:string = undefined) {
    if (!userId) {
      userId = Meteor.userId();
      if (!userId) {
        return null;
      }
    }
    if (userId===Meteor.userId())
      return Meteor.user(); 
    
    let user = Meteor.users.findOne({_id: userId});
    return user;
  }

  static getDisplayName(param:string = undefined):string;
  static getDisplayName(param:User):string;
  static getDisplayName(param:any):string {
    let user:User;
    if (param === undefined || typeof param === 'string') {
      user = AccountTools._user(param);
    } else if (typeof param === 'object') {
      user = param;
    }
    return AccountTools.getDisplayNameNoLookup(user);
  }
  static getDisplayNameNoLookup(user:User) {
    if (!user) {
      return 'Not Logged In';
    }
    if (user.username)
      return user.username;
    if (user.emails && user.emails.length>0)
      return user.emails[0].address;
    return user._id;
  }

}
