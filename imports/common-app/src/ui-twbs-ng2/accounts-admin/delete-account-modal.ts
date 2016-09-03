import { Meteor } from 'meteor/meteor';
import {Component} from '@angular/core';
import {AccountsModal} from './accounts-modal';
import {User} from '../../../../common-app-api';
import * as log from 'loglevel';

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
export class DeleteAccountModal extends AccountsModal {
  constructor() {
    super();
  }

  static openUser(user:User) {
    return AccountsModal._open(DeleteAccountModal, 'delete-account-modal', user);
  }


  deleteAccount() {
    Meteor.call('deleteUser', this.user._id, (error)=> {
      if (error) {
        log.error(error);
        this._error = error.message;
      }
      this.complete();
    });
  }
}
