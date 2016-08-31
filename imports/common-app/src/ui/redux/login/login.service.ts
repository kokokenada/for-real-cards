import { Meteor } from 'meteor/meteor'; declare let require:any;
import { Accounts } from 'meteor/accounts-base';
import { Observable } from 'rxjs'
import * as log from 'loglevel';

import {Credentials} from "../../services/credentials";
import {User} from '../../../../../common-app-api';
import {Tools} from "../../services/tools";
import {ILoginAction} from "./login.types";
import {LoginActions} from "./login-actions.class";
import {IPayloadAction} from "../action.interface";
import {BaseApp} from "../base-app.class";
let random = require("random-js");

// Make an abstract parent and children that implement specific backend
// For now, this is Meteor specific
export class LoginService {

  static login(credentials:Credentials):Promise<IPayloadAction> {
    return new Promise((resolve, reject)=>{
      credentials.saveCredentials();
      Meteor.loginWithPassword(
        credentials.email ? credentials.email : credentials.username, credentials.password,
        (error)=> {
          if (error) {
            log.info(error);
            reject(BaseApp.errorFactory(LoginActions.LOGIN_ERROR, error));
          } else {
            log.info('Login successful.');
            resolve(
              LoginActions.loginSuccessFactory(
                LoginService.userFromMeteorUser(Meteor.user())
              )
            );
          }
        });

    })
  }

  static register(credentials:Credentials):Promise<IPayloadAction> {
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
          reject(BaseApp.errorFactory(LoginActions.LOGIN_ERROR, error));
        } else {
          log.info("Register successful.")
          resolve(Meteor.user());
        }
      })
    });
  };

  static createTempUser():Promise<IPayloadAction> {
    return new Promise((resolve, reject)=>{
      Meteor.call('CommonGetNextSequence', 'temp_user', (error, result)=> {
        if (error) {
          reject(BaseApp.errorFactory(LoginActions.LOGIN_ERROR, error));
        } else {
          let userId = 'tmp_' + result.toString();
          let credentials:Credentials = new Credentials(
            userId,
            "",
            random.Random.integer(0,100000000).toString()
          );
          LoginService.register(credentials).then(
            (user) => {
              log.info("Registering tmp user successful.")
              resolve(user);
            }, (error)=> {  // Is this required or can I depend on rejection in AccountTools.register?
              reject(BaseApp.errorFactory(LoginActions.LOGIN_ERROR, error));
            }
          );
        }
      });
    });
  }

  static saveUser(edittedUserObject:User):Promise<IPayloadAction> {
    return new Promise( (resolve, reject)=> {
      console.log("in saveUser execution")
      Meteor.call('commonAppUpdateUser',
        edittedUserObject,
        function (error, numberAffected:number) {
          if (error) {
            log.error(error);
            reject(BaseApp.errorFactory(LoginActions.LOGIN_ERROR, error));
          } else {
            if (numberAffected === 1) {
              resolve(LoginActions.saveUserResponseFactory(edittedUserObject));
            } else {
              let errorDescription:string = 'Unexpected number of records affected. (' + numberAffected + ')';
              log.error(errorDescription);
              reject(BaseApp.errorFactory(LoginActions.LOGIN_ERROR, error));
            }
          }
        }
      );
    });
  }

  static logOut():Promise<IPayloadAction> {
    return new Promise((resolve, reject)=> {
      Meteor.logout((error)=> {
        if (error) {
          log.error('Error logging out')
          log.error(error)
          reject(BaseApp.errorFactory(LoginActions.LOGIN_ERROR, error));
        } else {
          resolve(LoginActions.logedOutFactory());
        }
      });
    })
  };

  static readCurrentUser():Promise<IPayloadAction> {
    return new Promise((resolve, reject)=>{
      Meteor.subscribe('user-edit', {reactive: false}, {
        onReady: ()=> {
          resolve(LoginActions.readCurUserResponseFactory(LoginService.user())); // Copy Current User
        },
        onStop: (error)=> {
          if (error) {
            log.error(error);
            reject(BaseApp.errorFactory(LoginActions.LOGIN_ERROR, error));
          }
        }
      });
    });
  }


  private static _user(userId:string = undefined) {
    if (!userId) {
      userId = LoginService.userId();
      if (!userId) {
        return null;
      }
    }
    if (userId===Meteor.userId())
      return Meteor.user();

    let user = Meteor.users.findOne({_id: userId});
    return user;
  }

  static getDisplayName(param:string):string;
  static getDisplayName(param:User):string;
  static getDisplayName(param:any):string {
    let user:any;
    if (param === undefined || typeof param === 'string') {
      user = LoginService._user(param);
    } else if (typeof param === 'object') {
      user = param;
    }
    return LoginService.getDisplayNameNoLookup(user);
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
    return LoginService.user()===null ? false : true;
  }

  static userId():string {
    return Meteor.userId();
  }

  static currentUserEmail():string {
    let user = LoginService._user();
    if (user) {
      if (user.emails && user.emails.length>0) {
        return user.emails[0].address;
      }
    }
    return '';
  }

  static userFromMeteorUser(userMeteor:Meteor.User):User {
    if (!userMeteor)
      return null;
    let user:User = new User();
    user._id = LoginService.userId();
    user.emails = userMeteor.emails;
    user.profile = userMeteor.profile;
    user.services = userMeteor.services;
    user.username = userMeteor.username;
//    user.roles = userMeteor.roles;
    return user;
  }

  static user():User {
    return LoginService.userFromMeteorUser(LoginService._user());
  }

}