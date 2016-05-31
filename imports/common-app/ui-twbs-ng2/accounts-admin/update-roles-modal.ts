import { Component } from '@angular/core';
import {AccountsModal} from './accounts-modal';
import {User} from '../../api/models/user.model';
import {Subject } from 'rxjs';
import {AccountTools} from '../../api/services/account-tools';
import {_} from 'meteor/underscore'
import {Roles} from 'meteor/alanning:roles'
import * as log from 'loglevel';
import {Meteor} from 'meteor/meteor';

@Component({
	module: 'common',
	selector: 'updateRolesModal',
	controllerAs: 'vm',
	controller: UpdateRolesModal,
	template:
		`
	<div class="modal-header">
		<h4>Update Roles</h4>
	</div>
 	<div class="modal-body">
 		<ul class="list-group">
 			<li class="list-group-item" ng-repeat="role in vm.allRoles()">
				<em ng-if="role==='admin'">Admin Role (admin)</em>
				<span ng-if="role!=='admin'">{{role}}</span>
				<button ng-if="role!=='admin'" class="btn btn-danger btn-xs" ng-click='vm.removeRole(role)' type="button">Delete</button>
			</li>
		</ul>
		<div class="input-group">
			<input type="text" class="form-control" value="" ng-model="vm.newRole">
			<span class="input-group-btn">
				<button ng-click="vm.addRole()" class="btn btn-success" type="button"><span class="glyphicon glyphicon-plus"></span> Create Role</button>
			</span>
		</div>
 	</div>
 	<div class="modal-footer">
		<span ng-show="vm.error.length" class="label label-danger">{{vm.error}}</span>
		<button type="button" ng-click="vm.dismiss()" class="btn btn-primary">Done</button>
	</div>
		
`})
export class UpdateRolesModal extends AccountsModal {
	newRole:string;
	constructor($scope) {
		super($scope);
	}

	static openRoles():Subject {
		return AccountsModal._open(null, UpdateRolesModal);
	}

	dismiss() {
		super.complete(false);
	}

	addRole():void {
		Meteor.call('addRole', this.newRole, (error)=> {
			if (error) {
				this._error = error.message;
				log.error(error)
			} else {
				super.complete(true);
			}
      super.timeoutApply();
		});
	}

	removeRole(role:string):void {
		Meteor.call('removeRole', role, (error)=> {
			if (error) {
				this._error = error.message;
				log.error(error)
			} else {
				super.complete(true);
			}
      super.timeoutApply();
		});

	}
}
