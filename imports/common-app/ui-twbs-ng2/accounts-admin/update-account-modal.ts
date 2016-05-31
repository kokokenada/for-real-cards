/**
 * Created by kenono on 2016-05-01.
 */
import { Component } from '@angular/core';
import {AccountsModal} from './accounts-modal';
import {User} from '../../api/models/user.model';
import {Subject } from 'rxjs';   
import {AccountTools} from '../../api/services/account-tools';
import {_} from 'meteor/underscore'
import {Roles} from 'meteor/alanning:roles'
import * as log from 'loglevel';

@Component({
  module: 'common',
  selector: 'updateAccountModal',
  controllerAs: 'vm',
  controller: UpdateAccountModal,
  template: 
`
        <div class="modal-header">
          <h4>Update {{vm.displayName()}}</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <div class="input-group">
              <span class="input-group-addon">Name</span>
              <input class="form-control admin-user-info" readonly="true" name="profile.name" ng-model="vm.profile.name">
            </div>
          </div>
          <ul ng-if="vm.getRoles().length" class="list-group">
            <li ng-repeat="role in vm.getRoles()" class="list-group-item">
              <button ng-click="vm.removeRole(role)" class="btn btn-danger btn-xs" type="button">
                <span class="glyphicon glyphicon-minus"></span> 
                Remove
              </button>
              <span class="pull-right">{{role}}</span>
            </li>
          </ul>
          <p ng-if="!vm.getRoles().length">This account has no roles.</p>
          
          <ul ng-if="vm.getUnsetRoles().length" class="list-group">
            <li ng-repeat="newRole in vm.getUnsetRoles()" class="list-group-item">
            <button type="button" ng-click="vm.addRole(newRole)" class="btn btn-success">
              <span class="glyphicon glyphicon-plus"></span> 
              Add Role
            </button>
            <span class="pull-right">{{newRole}}</span>
            </li>
          </ul>
          <em ng-if="!vm.getUnsetRoles().length">All roles already set.</em>
        </div>
        <div class="modal-footer">
          <span ng-show="vm.error.length" class="label label-danger">{{vm.error}}</span>
          <button type="button" ng-click="vm.done()" class="btn btn-primary">Done</button>
        </div>
        
`
})

export class UpdateAccountModal extends AccountsModal {
  private unsetRoles: string[];
  constructor($scope) {
    super($scope);
  }

  static openUser(user:User):Subject {
    return AccountsModal._open(user, UpdateAccountModal);
  }

    getUnsetRoles():string[]  {
    if (this.unsetRoles===undefined) {
      let allRoles:string[] = this.allRoles();
      if (!this.getRoles()) {
        this.unsetRoles = allRoles
      } else {
        this.unsetRoles = _.difference(allRoles, this.getRoles());
      }
    }
    return this.unsetRoles;
  }

  getRoles():string[] {
    return AccountsModal.user.roles;
  }
  
  addRole(role:string):void {
    Meteor.call('addUserRole',  AccountsModal.user._id, role, (error)=> {
      if (error) {
        log.error(error);
        this._error = error.message;
      } else {
        AccountsModal.user.roles.push(role);
        this.unsetRoles = _.without(this.unsetRoles, role);
      }
      this.timeoutApply();
    });
  }
  
  removeRole(role:string):void {
    Meteor.call('removeUserRole', AccountsModal.user._id, role, (error)=> {
      if (error) {
        log.error(error);
        this._error = error.message;
      } else {
        AccountsModal.user.roles = _.without(AccountsModal.user.roles, role);
        this.unsetRoles.push(role);
      }
      this.timeoutApply();
    });
  }

  done() {
    super.complete()
  }
}
