import { Component, NgZone } from '@angular/core';
import { Session } from 'meteor/session';
import { FilterDefinition, SortDefinitionSingle } from '../../../../common-app-meteor';
import {IUser, LoginPackage} from 'common-app';
import { AccountsAdminTools, Field } from '../../../../common-app-meteor';

import { UpdateAccountModal } from './update-account-modal';
import {DeleteAccountModal} from "./delete-account-modal";
import { Tracker } from 'meteor/tracker'
import {InfoAccountModal} from './info-account-modal'
import {ImpersonateAccountModal} from './impersonate-account-modal';
import {UpdateRolesModal} from "./update-roles-modal";
import {ModalActions} from '../../ui/redux/modal/modal-actions.class';

@Component({
  selector: 'accounts-admin',
  template: `

  <div class="row accounts-search">
   <div class="col-xs-offset-4 col-xs-8 col-md-offset-6 col-md-6 col-lg-offset-8 col-lg-4">
      <div class="input-group">
        <input type="text" class="form-control search-input-filter" [(ngModel)]="searchFilter"/>
        <span class="input-group-btn">
          <button class="btn btn-default" type="button">
            <span class="fa fa-search"></span>
          </button>
          <button class="btn btn-default" type="button" data-toggle="modal" (click)="updateRoles()">Manage Roles</button>
        </span>
      </div>
    </div>
  </div>
  <table class='table table-striped col-12'>
    <thead>
      <tr>
        <th></th>
        <th *ngFor="let field of fields()">{{field.label}}</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let user of users()">
        <td>
          <span (click)="deleteUser(user)" class="fa fa-trash"></span>
          <span (click)="updateUser(user)" class="fa fa-pencil"></span>
          <span (click)="infoUser(user)" class="fa fa-info"></span>
          <span (click)="impersonateUser(user)" class="fa fa-eye"></span>
        </td> 
        <td *ngFor="let field of fields()">{{field.displayText(user)}}</td>
      </tr>
    </tbody>
  </table>
  <a href="#" class="showMore" data-direction="-1">Previous {{pageSize}} users</a>
  <a href="#" class="showMore pull-right" data-direction="1">Next {{pageSize}} users</a>

`,
})
export class AccountsAdmin {
  searchFilter:string;
  usersArray: IUser[];
  skip:number;
  sort:SortDefinitionSingle;
  filter:string;
  computation:Tracker.Computation;
  static throttledSearch(search:string) {  };

  constructor(private ngZone:NgZone) {
    this.usersArray = [];
    this.skip = 0;
    this.sort = {key: 'username', direction:1};
    this.filter = "";
    Tracker.autorun((computation)=>{
      this.computation = computation;
      let subscriptionHandle =AccountsAdminTools.subscribeToPublication(this.currentFilter());
      if (subscriptionHandle.ready()) {
        let cursor:any = AccountsAdminTools.filteredUserQuery(LoginPackage.lastLoginState.userId, this.currentFilter()); // Cursor
        ngZone.run( ()=>{
          this.usersArray = cursor.fetch();
        } );
      }
    })
  }

  private currentFilter():FilterDefinition {
    return {filter: this.filter, skip: this.skip, sort:this.sort};
  }

  updateUser(user: IUser) {
    ModalActions.openRequest(UpdateAccountModal, {user});
  }

  deleteUser(user: IUser) {
    ModalActions.openRequest(DeleteAccountModal, {user});
  }

  infoUser(user: IUser) {
    ModalActions.openRequest(InfoAccountModal, {user});
  }

  impersonateUser(user: IUser) {
    ModalActions.openRequest(ImpersonateAccountModal, {user});
  }

  updateRoles() {
    ModalActions.openRequest(UpdateRolesModal);
//          this.computation.invalidate();
  }

  fields():Field[] {
    return AccountsAdminTools.getFields();
  }


  users(): IUser[] {
    return this.usersArray;
  }

  maxUsersPerPage() {
    return AccountsAdminTools.config.maxUsersPerPage;
  }

  onSearchKeyUp() {
    AccountsAdmin.throttledSearch(this.searchFilter);
  }

  showMore(event, direction) {
    event.preventDefault();

    this.skip += (AccountsAdminTools.config.maxUsersPerPage * direction);
    this.users();
  }

  destroyed() {
    //clean up the session
  }

  doSort(key, direction) {
    this.sort.key = key;
    this.sort.direction = direction;
  }

  sortIndicator(event, key) {
    event.preventDefault();
    this.sort.direction *= -1;
    this.sort.key = key;
  }
}
AccountsAdmin.throttledSearch = _.throttle((searchFilter)=> {
// search no more than 2 times per second
  Session.set("accountsAdminUserFilter", searchFilter);
}, 500);

