import { Component, OnInit } from '@angular/core';
import { AccountsModal } from './accounts-modal';
import { AccountsAdminActions } from "../../ui/redux/accounts-admin/accounts-admin-actions.class";

declare let Meteor:any;  // Meteor.connection barfs

@Component({
  selector: 'impersonate-account-modal',
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
export class ImpersonateAccountModal extends AccountsModal implements OnInit {

  impersonate():void {
    AccountsAdminActions.impersonateRequest(this.user._id);
  }
}

