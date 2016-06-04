import { Component } from '@angular/core';
import {AccountsModal} from './accounts-modal';
import {User} from '../../api/models/user.model';
import * as log from 'loglevel';

declare let Meteor:any;  // Meteor.connection barfs

@Component({
  selector: 'impersonate-account-modal',
  controller: ImpersonateAccountModal,
  template: `

  <div class="modal-header">
    <h4>Impersonate Account</h4>
  </div>
  <div class="modal-body">
    <h4>Do you want to impersonate this account: {{displayName()}}?</h4>
  </div>
  <div class="modal-footer">
    <span *ngIf="vm.error?.length" class="label label-danger">{{error}}</span>
    <button type="button" (click)="cancel()" class="btn btn-default">Cancel</button>
    <button type="button" (click)="impersonate()" class="btn btn-danger">Impersonate</button>
  </div>
 
`
})
export class ImpersonateAccountModal extends AccountsModal {
  constructor() {
    super();
  }

  static openUser(user:User):Promise {
    return AccountsModal._open(ImpersonateAccountModal, 'impersonate-account-modal', user);
  }
  
  impersonate():void {
    Meteor.call('impersonateUser', this.user._id, (error)=> {
      if (error) {
        this._error = error.message;
        log.error(error);
      } else {
        Meteor.connection.setUserId(this.user._id);
/*        if (AccountsAdminTools.config.impersonationSuccess) {
          AccountsAdminTools.config.impersonationSuccess();
        }*/
        super.complete();
      }
    });
  }
}

