import {Component} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import 'meteor/alanning:roles'
import * as log from 'loglevel';

import {AccountsModal} from './accounts-modal';
import {User} from '../../../../common-app-api';

@Component({
  selector: 'update-account-modal',
  template: `
        <div class="modal-header">
          <h4>Update {{displayName()}}</h4>
        </div>
        <div class="modal-body">
          <div *ngIf="user.profile" class="form-group">
            <div class="input-group">
              <span class="input-group-addon">Name</span>
              <input class="form-control admin-user-info" readonly="true" [(ngModel)]="user.profile.name">
            </div>
          </div>
          <ul *ngIf="getRoles().length" class="list-group">
            <li *ngFor="let role of getRoles()" class="list-group-item">
              <button (click)="removeRole(role)" class="btn btn-danger btn-xs" type="button">
                <span class="fa fa-minus-circle"></span> 
                Remove
              </button>
              <span class="pull-right">{{role}}</span>
            </li>
          </ul>
          <p *ngIf="!getRoles().length">This account has no roles.</p>
          
          <ul *ngIf="getUnsetRoles().length" class="list-group">
            <li *ngFor="let newRole of getUnsetRoles()" class="list-group-item">
            <button type="button" (click)="addRole(newRole)" class="btn btn-success">
              <span class="fa fa-plus-circle"></span> 
              Add Role
            </button>
            <span class="pull-right">{{newRole}}</span>
            </li>
          </ul>
          <em *ngIf="!getUnsetRoles().length">All roles already set.</em>
        </div>
        <div class="modal-footer">
          <span *ngIf="error?.length" class="label label-danger">{{error}}</span>
          <button type="button" (click)="complete()" class="btn btn-primary">Done</button>
        </div>
        
`
})

export class UpdateAccountModal extends AccountsModal {
  private unsetRoles:string[];

  constructor() {
    super();
  }

  static openUser(user:User):Promise<any> {
    return AccountsModal._open(UpdateAccountModal, 'update-account-modal', user);
  }

  getUnsetRoles():string[] {
    if (this.unsetRoles === undefined) {
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
    return this.user.roles;
  }

  addRole(role:string):void {
    Meteor.call('addUserRole', this.user._id, role, (error)=> {
      if (error) {
        log.error(error);
        this._error = error.message;
      } else {
        this.user.roles.push(role);
        this.unsetRoles = _.without(this.unsetRoles, role);
      }
      this.timeoutApply();
    });
  }

  removeRole(role:string):void {
    Meteor.call('removeUserRole', this.user._id, role, (error)=> {
      if (error) {
        log.error(error);
        this._error = error.message;
      } else {
        this.user.roles = _.without(this.user.roles, role);
        this.unsetRoles.push(role);
      }
      this.timeoutApply();
    });
  }
}
