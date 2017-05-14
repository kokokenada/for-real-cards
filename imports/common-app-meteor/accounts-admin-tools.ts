/**
 * Created by kenono on 2016-05-01.
 */
import { Meteor } from 'meteor/meteor';

declare let Roles;

import { PagingTools, FilterDefinition} from "./page-tools"
import {IUser} from 'common-app';

const SUBSCRIPTION_NAME = 'common-AccountsAdminTools';




// TO DO: Rip out Meteor specifics


export interface AccountsAdminToolsConfig {
  maxUsersPerPage: number;
  allowImpersonation: boolean;
}

export interface FieldInterface {
  key:string;
  label:string;
  fn?(display:any):string
}

export class Field implements FieldInterface {
  constructor(field:FieldInterface) {
    this.key = field.key;
    this.label = field.label;
    if (field.fn) {
      this.fn = field.fn;
    }
  }

  key:string;
  label:string;

  fn(user:IUser):string {
    if (!user)
      return "";
    return user[this.key]
  }

  displayText(user:IUser):string {
    return this.fn(user);
  }
}



export class AccountsAdminTools {

  static config:AccountsAdminToolsConfig = {
    maxUsersPerPage: 25,
    allowImpersonation: false
  };

  private static users:IUser[] = [];
  protected static fields:Field[] = [
    new Field({
      key: 'username',
      label: 'username'
    }),
    new Field({
      key: 'profile.name',
      label: 'Name'
    }),
    new Field({
      key: 'profile.organization',
      label: 'Organization'
    }),
    new Field({
      key: 'emails.0.address',
      label: 'Email',
      fn: function (user) {
        return AccountsAdminTools.getEmail(user);
      }
    }),
    new Field({
      key: 'roles',
      label: 'Roles',
      fn: function (user) {
        return AccountsAdminTools.getRoles(user);
      }
    }),
    new Field({
      key: 'createdAt',
      label: 'Created',
      fn: function (user) {
        let value = user.dateCreated;
        return value && value.toDateString();
      }
    })/*,
    new Field({
      key: 'status.lastLogin.date',
      label: 'Last Login',
      fn: function (user) {
        try {
          let value = user.status.lastLogin.date;
          return value && value.toLocaleString();
        } catch(e) {
          return ""
        }
      }
    }),
    new Field({
      key: 'status.online',
      label: 'Online?'
    })*/
  ];

  static getFields():Field[] {
    return AccountsAdminTools.fields;
  }

//Userid - current user
//Options:
//  filter - alphanumeric string to search users name and email for
//  skip - skip the first n values
//  sort - return the users in the order specified by this sort object
  static filteredUserQuery(userId, options:FilterDefinition):Mongo.Cursor<Meteor.User> {

    let cursor:Mongo.Cursor<Meteor.User>;
    // if not an admin user don't show any other user
    if (!Roles.userIsInRole(userId, ['admin'])) {
      cursor = Meteor.users.find(userId, {reactive: false, fields: {username:true}});
    } else {

      let queryOptions:any = {};

      if (Meteor.isServer) { //skip and limit force reactive-table to use addedBefore instead of added on the observer
        //since these are really for server paging, no need to do them on the client
        queryOptions.limit = AccountsAdminTools.config.maxUsersPerPage;
        if (options.skip && !options.filter) {
          queryOptions.skip = options.skip;
        }
      } else {
        // Hide sensative fields
        let fields = {};
        AccountsAdminTools.fields.forEach((field)=>{
          let key:string = field.key;
          if (key.indexOf(".")===-1)
            fields[key] = 1
        });
        fields['emails'] = 1;
        fields['profile'] = 1;
        queryOptions.fields = fields;
      }

      if (options.sort) {
        queryOptions.sort = {};
        queryOptions.sort[options.sort.key] = options.sort.direction;
      }

      var query = {};
      if (options.filter) {
        var filter = options.filter.replace(/[^\w]/g, '.'); //my take on santizing the filter
        query = {
          $or: [{
            'profile.name': {
              $regex: filter,
              $options: 'i'
            }
          }, {
            'emails.address': {
              $regex: filter,
              $options: 'i'
            }
          }]
        };
      }
      cursor = Meteor.users.find(query, queryOptions);
    }
    return cursor;
  }


  static getRoles(user) {
    let roles = user.roles;
    if (!roles)
      return "";
    return roles.join(',');
  }

  static getEmail(user) {

    if (user.emails && user.emails.length)
      return user.emails[0].address;

    if (user.services && _.isArray(user.services)) {
      //Iterate through services
      user.services.forEach(function (serviceName) {
        var serviceObject = user.services[serviceName];
        //If an 'id' isset then assume valid service
        if (serviceObject.id) {
          if (serviceObject.email) {
            return serviceObject.email;
          }
        }
      });
    }
    return "";
  }
  
  static subscribeToPublication(options:FilterDefinition) {
    return Meteor.subscribe(SUBSCRIPTION_NAME, options);
  }

  static isAdmin(user:Meteor.User) : boolean {
    return user && Roles.userIsInRole(user, ['admin']);
  }
  
}
