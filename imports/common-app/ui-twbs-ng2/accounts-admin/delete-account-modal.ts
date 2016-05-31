import { Component } from '@angular/core';
import {AccountsModal} from './accounts-modal';
import {User} from '../../api/models/user.model';
import { Subject } from 'rxjs';
import {AccountTools} from '../../api/services/account-tools';
import * as log from 'loglevel';

@Component({
	module: 'common',
	selector: 'deleteAccountModal',
	controllerAs: 'vm',
	controller: DeleteAccountModal,
	template: `
	 	<div class="modal-body">
	 		<h4>Are you sure you want to delete {{vm.displayName()}}?</h4>
	 	</div>
	 	<div class="modal-footer">
			<span ng-show="vm.error.length" class="label label-danger">{{vm.error}}</span>
			<button type="button" ng-click="vm.cancel()" lass="btn btn-default">Cancel</button>
			<button type="button" ng-click="vm.deleteAccount()" class="btn btn-danger">Delete</button>
		</div>
		
`
})
export class DeleteAccountModal extends AccountsModal {
	constructor($scope) {
		super($scope);
	}

	static openUser(user:User) {
		return AccountsModal._open(user, DeleteAccountModal);
	}


	deleteAccount() {
		Meteor.call('deleteUser', AccountsModal.user._id, (error)=> {
			if (error) {
				log.error(error);
				this._error = error.message;
			} else {
				this.complete(true);
			}
		});
	}

	cancel() {
		this.complete(false);
	}
}
