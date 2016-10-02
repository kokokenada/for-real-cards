import { Meteor } from 'meteor/meteor';

import {User} from '../../../../common-app-api/src/api/models/user.model';

export class AccountTools {

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

  static getDisplayName(param:string):string;
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
