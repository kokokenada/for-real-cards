import { Component, OnInit } from '@angular/core';
import { AccountsModal } from './accounts-modal';
import 'meteor/underscore'
import 'meteor/alanning:roles'
import {AccountsAdminActions} from "../../ui/redux/accounts-admin/accounts-admin-actions.class";
import {ModalActions} from "../../ui/redux/modal/modal-actions.class";

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
				<button *ngIf="role!=='admin'" class="btn btn-danger btn-xs" (click)='removeRole(role)' type="button"><span class="fa fa-minus-circle"></span> Delete</button>
			</li>
		</ul>
		<div class="input-group">
			<input type="text" class="form-control" value="" [(ngModel)]="newRole">
			<span class="input-group-btn">
				<button (click)="addRole()" class="btn btn-success" type="button"><span class="fa fa-plus-circle"></span>  Create Role</button>
			</span>
		</div>
 	</div>
 	<div class="modal-footer">
		<span *ngIf="error?.length" class="label label-danger">{{error}}</span>
		<button type="button" (click)="complete()" class="btn btn-primary">Done</button>
	</div>
		
`})
export class UpdateRolesModal extends AccountsModal implements OnInit {
	newRole:string;
	constructor(private accountsAdminActions:AccountsAdminActions, private modalActions:ModalActions) {
		super(modalActions);
	}

	addRole():void {
		this.accountsAdminActions.systemRoleChangeRequest(this.newRole, true);
	}

	removeRole(role:string):void {
		this.accountsAdminActions.systemRoleChangeRequest(this.newRole, false);
	}
}
