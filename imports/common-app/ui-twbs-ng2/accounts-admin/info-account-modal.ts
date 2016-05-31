import { Component } from '@angular/core';
import {AccountsModal} from './accounts-modal';
import {User} from '../../api/models/user.model';
import {Subject } from 'rxjs';
import {AccountTools} from '../../api/services/account-tools';

@Component({
  module: 'common',
  selector: 'infoAccountModal',
  controllerAs: 'vm',
  controller: InfoAccountModal,
  template: `

  <div class="modal-header">
    <h4>Account Info {{vm.displayName()}}</h4>
  </div>
  <div class="modal-body">
    <ul class="list-group">
				<li class="list-group-item"><strong>ID</strong><span class="pull-right">{{vm.user._id}}</span></li>
				<li class="list-group-item"><strong>Created</strong><span class="pull-right">{{vm.user.createdAt}}</span></li>
				<li class="list-group-item"><strong>Roles</strong>
					<span ng-repeat="role in vm.user.roles">{{role}} </span>
				</li>
				<textarea style='width: 90%; height:40vh; overflow-y: scroll'>{{vm.getXMLDump()}}</textarea>
			</ul>
	 	</div>
	 	<div class="modal-footer">
			<button type="button" ng-click="vm.dismiss()" class="btn btn-primary">OK</button>
		</div>
		
`
})
export class InfoAccountModal extends AccountsModal {
  constructor($scope) {
    super($scope);
  }

  static openUser(user:User):Subject {
    return AccountsModal._open(user, InfoAccountModal);
  }

  get user():User {
    return AccountsModal.user;
  }

  getXMLDump():string {
    return JSON.stringify(AccountsModal.user, null, ' ');
  }

  dismiss():void {
    super.complete();
  }
}

