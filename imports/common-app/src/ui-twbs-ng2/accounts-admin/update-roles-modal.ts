import { Component } from '@angular/core';
import { AccountsModal } from './accounts-modal';
import 'meteor/underscore'
import 'meteor/alanning:roles'
import * as log from 'loglevel';
import { Meteor } from 'meteor/meteor';

@Component({
	selector: 'update-roles-modal',
	template:
		`
	<div class="modal-header">
		<h4>Update Roles</h4>
	</div>
 	<div class="modal-body">
 		<ul class="list-group">
 			<li class="list-group-item" *ngFor="let role of allRoles()">
				<em *ngIf="role==='admin'">Admin Role (admin)</em>
				<span *ngIf="role!=='admin'">{{role}}</span>
				<button *ngIf="role!=='admin'" class="btn btn-danger btn-xs" (click)='removeRole(role)' type="button">Delete</button>
			</li>
		</ul>
		<div class="input-group">
			<input type="text" class="form-control" value="" [(ngModel)]="newRole">
			<span class="input-group-btn">
				<button (click)="addRole()" class="btn btn-success" type="button"><span class="glyphicon glyphicon-plus"></span> Create Role</button>
			</span>
		</div>
 	</div>
 	<div class="modal-footer">
		<span *ngIf="error?.length" class="label label-danger">{{error}}</span>
		<button type="button" (click)="complete()" class="btn btn-primary">Done</button>
	</div>
		
`})
export class UpdateRolesModal extends AccountsModal {
	newRole:string;
	constructor() {
		super();
	}

	static openRoles():Promise<any> {
		return AccountsModal._open(UpdateRolesModal, 'update-roles-modal', null);
	}

	addRole():void {
		Meteor.call('addRole', this.newRole, (error)=> {
			if (error) {
				this._error = error.message;
				log.error(error)
			} else {
				super.complete();
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
				super.complete();
			}
      super.timeoutApply();
		});

	}
}
