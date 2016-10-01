
import { Injectable, Injector, ComponentFactory, ComponentFactoryResolver, Component, ComponentRef, Type, ViewContainerRef } from '@angular/core';

import { Meteor } from 'meteor/meteor';

@Injectable()
export class AccountsAdminService {
  deleteAccount(userId:string):Promise<boolean> {
    return new Promise<boolean>( (resolve, reject)=> {
      Meteor.call('deleteUser', userId, (error)=> {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });

    });
  }

  impersonate(userId:string):Promise<boolean> {
    return new Promise<boolean>( (resolve, reject)=> {
      Meteor.call('impersonateUser', userId, (error)=> {
        if (error) {
          reject(error);
        } else {
          Meteor.connection.setUserId(userId);
          /*        if (AccountsAdminTools.config.impersonationSuccess) {
           AccountsAdminTools.config.impersonationSuccess();
           }*/
          resolve(true);
        }
      });
    });
  }

  addUserRole(userId:string, role:string):Promise<boolean> {
    return new Promise<boolean>( (resolve, reject)=> {
      Meteor.call('addUserRole', userId, role, (error)=> {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });

    });
  }

  removeUserRole(userId:string, role:string):Promise<boolean> {
    return new Promise<boolean>( (resolve, reject)=> {
      Meteor.call('removeUserRole', userId, role, (error)=> {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

  addRole(newRole:string):Promise<boolean> {
    return new Promise<boolean>( (resolve, reject)=> {
      Meteor.call('addRole', newRole, (error)=> {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });

    });
  }

  removeRole(role:string):Promise<boolean> {
    return new Promise<boolean>( (resolve, reject)=> {
      Meteor.call('removeRole', role, (error)=> {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

}
