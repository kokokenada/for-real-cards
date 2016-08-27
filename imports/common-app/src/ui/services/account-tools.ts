import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { Observable, Subject, Subscription } from 'rxjs'
import * as log from 'loglevel';

import {User} from '/imports/common-app-api';
import {Tools} from "./tools"
import {Credentials} from "./credentials";
import {UserEvent, UserEventType} from "../models/user-event.class";

export class AccountTools {
  
  static login(credentials:Credentials):Promise {
    return new Promise((resolve, reject)=>{
      credentials.saveCredentials();
      Meteor.loginWithPassword(
        credentials.email ? credentials.email : credentials.username, credentials.password,
        (error)=> {
          if (error) {
            log.error(error);
            reject(error);
          } else {
            log.info('Login successful.');
            UserEvent.pushEvent(new UserEvent(UserEventType.LOGIN, {userId: AccountTools.userId()}));
            resolve(Meteor.user());
          }
        });
      
    })
  }

  static register(credentials:Credentials):Promise {
    return new Promise((resolve, reject)=>{
      log.debug("Creating user:" + credentials.username + ", " + credentials.email);
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
          reject(error);
        } else {
          log.info("Register successful.")
          UserEvent.pushEvent(new UserEvent(UserEventType.LOGIN, {userId: AccountTools.userId()}));
          resolve(Meteor.user());
        }
      })
    });
  };

  static createTempUser():Promise {
    return new Promise((resolve, reject)=>{
      Meteor.call('CommonGetNextSequence', 'temp_user', (error, result)=> {
        if (error) {
          reject(error);
        } else {
          let userId = 'tmp_' + result.toString();
          let credentials:Credentials = new Credentials(
            userId,
            "",
            Math.random().toString()
          );
          AccountTools.register(credentials).then(
            (user) => {
              log.info("Registering tmp user successful.")
              UserEvent.pushEvent(new UserEvent(UserEventType.LOGIN, {userId: AccountTools.userId()}));
              resolve(user);
            }, (error)=> {  // Is this required or can I depend on rejection in AccountTools.register?
              reject(error);
            }
          );
        }
      });
    });
  }

  static saveUser(edittedUserObject:User):Observable {
    let observable:Observable = Observable.create( (observer)=> {
      console.log("in saveUser execution")
      Meteor.call('commonAppUpdateUser',
        edittedUserObject,
        function (error, numberAffected:number) {
          if (error) {
            log.error(error);
            observer.error(error);
          } else {
            if (numberAffected === 1) {
              observer.next(edittedUserObject);
              observer.complete();
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
    Meteor.logout((error)=> {
      if (error) {
        log.error('Error logging out')
        log.error(error)
      } else {
        UserEvent.pushEvent(new UserEvent(UserEventType.LOGOUT));
      }
      
    });
  };
  
  static readCurrentUser():Promise {
    return new Promise((resolve, reject)=>{
      Meteor.subscribe('user-edit', {reactive: false}, {
        onReady: ()=> {
          resolve(Tools.deepCopy(Meteor.user())); // Copy Current User
        },
        onStop: (error)=> {
          if (error) {
            log.error(error);
            reject(error);
          }
        }
      });
    });
  }

 
  private static _user(userId:string = undefined) {
    if (!userId) {
      userId = AccountTools.userId();
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
    let user:any;
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

  static isLoggedIn():boolean {
    return AccountTools.userId()===null ? false : true;
  }
  
  static userId():string {
    return Meteor.userId();
  }
}
