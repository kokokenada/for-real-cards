/**
 * Created by kenono on 2016-05-01.
 */
import  'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { User} from '../../../../common-app-api';
import { check, Match } from 'meteor/check'

import { PagingTools, FilterDefinition} from "./page-tools"


const SUBSCRIPTION_NAME = 'common-AccountsAdminTools';

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

  fn(user:User):string {
    if (!user)
      return "";
    return user[this.key]
  }

  displayText(user:User):string {
    return this.fn(user);
  }
}



export class AccountsAdminTools {

  static config:AccountsAdminToolsConfig = {
    maxUsersPerPage: 25,
    allowImpersonation: false
  };

  private static users:User[] = [];
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
  
}

if (Meteor.isServer) {

  Meteor.methods({
    deleteUser: function(userId) {
      check(userId, String);
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['admin']))
        throw new Meteor.Error(401, "You need to be an admin to delete a user.");

      if (user._id == userId)
        throw new Meteor.Error(422, 'You can\'t delete yourself.');

      // remove the user
      Meteor.users.remove(userId);
    },

    addUserRole: function(userId, role, group) {
      check(userId, String);
      check(role, String);
      check(group, Match.Optional(String));
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['admin']))
        throw new Meteor.Error(401, "You need to be an admin to update a user.");

      if (user._id === userId && !Roles.userIsInRole(user, ['admin']))
        throw new Meteor.Error(422, 'You can\'t update yourself unless you are an admin.');

      // handle invalid role
      if (Meteor.roles.find({name: role}).count() < 1 )
        throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

      // handle user already has role
      if (Roles.userIsInRole(userId, role, group))
        throw new Meteor.Error(422, 'Account already has the role ' + role);

      // add the user to the role
      Roles.addUsersToRoles(userId, role, group);
    },

    removeUserRole: function(userId, role, group) {
      check(userId, String);
      check(role, String);
      check(group, Match.Optional(String));
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['admin']))
        throw new Meteor.Error(401, "You need to be an admin to update a user.");

      if (user._id === userId &&  !Roles.userIsInRole(user, ['admin']))
        throw new Meteor.Error(422, 'You can\'t update yourself unless you are and admin.');

      // handle invalid role
      if (Meteor.roles.find({name: role}).count() < 1 )
        throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

      // handle user already has role
      if (!Roles.userIsInRole(userId, role, group))
        throw new Meteor.Error(422, 'Account does not have the role ' + role);

      Roles.removeUsersFromRoles(userId, role, group);
    },

    addRole: function(role) {
      check(role, String);
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['admin']))
        throw new Meteor.Error(401, "You need to be an admin to update a user.");

      // handle existing role
      if (Meteor.roles.find({name: role}).count() > 0 )
        throw new Meteor.Error(422, 'Role ' + role + ' already exists.');

      Roles.createRole(role);
    },

    removeRole: function(role) {
      check(role, String);
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['admin']))
        throw new Meteor.Error(401, "You need to be an admin to update a user.");

      // handle non-existing role
      if (Meteor.roles.find({name: role}).count() < 1 )
        throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

      if (role === 'admin')
        throw new Meteor.Error(422, 'Cannot delete role admin');

      // remove the role from all users who currently have the role
      // if successfull remove the role
      Meteor.users.update(
        {roles: role },
        {$pull: {roles: role }},
        {multi: true},
        function(error) {
          if (error) {
            throw new Meteor.Error(422, error);
          } else {
            Roles.deleteRole(role);
          }
        }
      );
    },

    updateUserInfo: function(id, property, value) {
      check(id, String);
      check(property, String);
      //Giving the value a range of possible safe values
      check(value, Match.OneOf(String, Number, Boolean, Date, undefined, null));
      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['admin'])) {
        throw new Meteor.Error(401, "You need to be an admin to update a user.");
      }

      if (property !== 'profile.name') {
        throw new Meteor.Error(422, "Only 'name' is supported.");
      }

      var obj = {};
      obj[property] = value;
      Meteor.users.update({_id: id}, {$set: obj});

    },

    //Inspired by: https://dweldon.silvrback.com/impersonating-a-user
    impersonateUser: function(targetUserId) {
      check(targetUserId, String);

      var user = Meteor.user();
      if (!user || !Roles.userIsInRole(user, ['admin']))
        throw new Meteor.Error(401, "You need to be an admin to impersonate a user.");

      if (! Meteor.users.findOne(targetUserId))
        throw new Meteor.Error(422, "Unable to find targetUserId to impersonate: " + targetUserId);


      if (AccountsAdminTools.config.allowImpersonation) {
        this.setUserId(targetUserId);
      }
      else
        throw new Meteor.Error(422, "Enable AccountsAdmin.config.allowImpersonation key to allow impersonation");

    },

  });

  Meteor.publish(SUBSCRIPTION_NAME, function(options:FilterDefinition) {

    PagingTools.check(options);

    let cursorUsers:Mongo.Cursor<Meteor.User> = AccountsAdminTools.filteredUserQuery(this.userId, options);

    return [
      cursorUsers,
      Meteor.roles.find({})
    ];
  });
}
