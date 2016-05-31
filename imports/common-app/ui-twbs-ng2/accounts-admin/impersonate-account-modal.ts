import { Component } from '@angular/core';
import {AccountsModal} from './accounts-modal';
import {User} from '../../api/models/user.model';
import {Subject } from 'rxjs';
import {AccountTools} from '../../api/services/account-tools';
import * as log from 'loglevel';
import {AccountsAdminTools} from '../../api/services/accounts-admin-tools'

@Component({
  module: 'common',
  selector: 'impersonateAccountModal',
  controllerAs: 'vm',
  controller: ImpersonateAccountModal,
  template: `

  <div class="modal-header">
    <h4>Impersonate Account</h4>
  </div>
  <div class="modal-body">
    <h4>Do you want to impersonate this account: {{vm.displayName()}}?</h4>
  </div>
  <div class="modal-footer">
    <span ng-show="vm.error.length" class="label label-danger">{{vm.error}}</span>
    <button type="button" ng-click="vm.dismiss()" class="btn btn-default">Cancel</button>
    <button type="button" ng-click="vm.impersonate()" class="btn btn-danger">Impersonate</button>
  </div>
 
`
})
export class ImpersonateAccountModal extends AccountsModal {
  constructor($scope) {
    super($scope);
  }

  static openUser(user:User):Subject {
    return AccountsModal._open(user, ImpersonateAccountModal);
  }
  
  impersonate():void {
    Meteor.call('impersonateUser', AccountsModal.user._id, (error)=> {
      if (error) {
        this._error = error.message;
        log.error(error);
      } else {
        Meteor.connection.setUserId(AccountsModal.user._id);
        if (AccountsAdminTools.config.impersonationSuccess) {
          AccountsAdminTools.config.impersonationSuccess();
        }
        super.complete(true);
      }
      super.timeoutApply();
    });
  }
  
  dismiss():void {
  super.complete(false);
    }
}

