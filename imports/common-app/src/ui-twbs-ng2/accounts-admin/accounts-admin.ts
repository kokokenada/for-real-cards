import { Component, NgZone } from '@angular/core';
import { Session } from 'meteor/session';
import { PagingTools, FilterDefinition, SortDefinitionSingle } from "../../ui"
import { User, AccountsAdminTools, Field } from '../../../../common-app-api';

import { UpdateAccountModal } from './update-account-modal';
import {DeleteAccountModal} from "./delete-account-modal";
import { Tracker } from 'meteor/tracker'
import {CommonPopupsTWBS} from '../common-popups/common-popups.twbs'
import {InfoAccountModal} from './info-account-modal'
import {ImpersonateAccountModal} from './impersonate-account-modal';
import {UpdateRolesModal} from "./update-roles-modal";
import {AccountTools} from "../../ui/index";

@Component({
  selector: 'accounts-admin',
  template: `

  <div class="row accounts-search">
   <div class="col-xs-offset-4 col-xs-8 col-md-offset-6 col-md-6 col-lg-offset-8 col-lg-4">
      <div class="input-group">
        <input type="text" class="form-control search-input-filter" [(ngModel)]="searchFilter"/>
        <span class="input-group-btn">
          <button class="btn btn-default" type="button">
            <span class="glyphicon glyphicon-search"></span>
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
          <span (click)="deleteUser(user)" class="glyphicon glyphicon-trash"></span>
          <span (click)="updateUser(user)" class="glyphicon glyphicon-pencil"></span>
          <span (click)="infoUser(user)" class="glyphicon glyphicon-info-sign"></span>
          <span (click)="impersonateUser(user)" class="glyphicon glyphicon-eye-open"></span>
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
  usersArray:User[];
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
        let cursor:any = AccountsAdminTools.filteredUserQuery(AccountTools.userId(), this.currentFilter()); // Cursor
        ngZone.run( ()=>{
          this.usersArray = cursor.fetch();
        } );
      }
    })
  }

  private currentFilter():FilterDefinition {
    return {filter: this.filter, skip: this.skip, sort:this.sort};
  }

  updateUser(user:User) {
    UpdateAccountModal.openUser(user)
  }

  deleteUser(user:User) {
    DeleteAccountModal.openUser(user).then(
      (payload:boolean)=> {
        if (payload) {
          this.computation.invalidate();
        }
      },
      (error)=>{
        CommonPopupsTWBS.alert(error)
      }
    );
  }

  infoUser(user:User) {
    InfoAccountModal.openUser(user);
  }

  impersonateUser(user:User) {
    ImpersonateAccountModal.openUser(user);
  }

  updateRoles() {
    UpdateRolesModal.openRoles().then(
      (payload:boolean)=> {
        if (payload) {
          this.computation.invalidate();
        }
      },
      (error)=>{
        CommonPopupsTWBS.alert(error)
      }
    );
  }

  fields():Field[] {
    return AccountsAdminTools.getFields();
  }


  users():User[] {
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

