import { Component, OnInit } from '@angular/core';
import 'meteor/alanning:roles'

import {AccountsModal} from './accounts-modal';
import {AccountsAdminActions} from "../../ui/redux/accounts-admin/accounts-admin-actions.class";

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

export class UpdateAccountModal extends AccountsModal implements OnInit {
  private unsetRoles:string[];

  constructor(private accountsAdminActions:AccountsAdminActions) {
    super();
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
// TODO: fix update (with subscription??)
  // old code:           this.user.roles.push(role);
///  this.unsetRoles = _.without(this.unsetRoles, role);

  addRole(role:string):void {
    this.accountsAdminActions.userRoleChangeRequest(this.user._id, role, true);
  }

  removeRole(role:string):void {
    this.accountsAdminActions.userRoleChangeRequest(this.user._id, role, false);
  }
}
