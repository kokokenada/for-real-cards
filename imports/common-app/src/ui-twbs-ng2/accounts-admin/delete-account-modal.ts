
import {Component, OnInit} from '@angular/core';
import {AccountsModal} from './accounts-modal';
import {AccountsAdminActions} from "../../ui/redux/accounts-admin/accounts-admin-actions.class";

@Component({
  selector: 'delete-account-modal',
  template: `
	 	<div class="modal-body">
	 		<h4>Are you sure you want to delete {{displayName()}}?</h4>
	 	</div>
	 	<div class="modal-footer">
			<span *ngIf="error?.length" class="label label-danger">{{error}}</span>
			<button type="button" (click)="cancel()" class="btn btn-default">Cancel</button>
			<button type="button" (click)="deleteAccount()" class="btn btn-danger">Delete</button>
		</div>
		
`
})
export class DeleteAccountModal extends AccountsModal implements OnInit {
  deleteAccount() {
    AccountsAdminActions.deleteRequest(this.user._id);
    this.close();
  }
}
