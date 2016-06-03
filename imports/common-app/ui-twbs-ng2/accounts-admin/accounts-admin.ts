import { Component } from '@angular/core';
import { AccountsAdminTools, Field } from '../../api/services/accounts-admin-tools';
import { User } from '../../api/models/user.model'
//import { Cursor } from 'meteor/mongo'
import { Session } from 'meteor/session';
import { PagingTools, FilterDefinition, SortDefinitionSingle } from "../../api/services/page-tools"
import { UpdateAccountModal } from './update-account-modal';
import {DeleteAccountModal} from "./delete-account-modal";
import { Tracker } from 'meteor/tracker'
import {CommonPopups} from '../common-popups/common-popups'
import {InfoAccountModal} from './info-account-modal'
import {ImpersonateAccountModal} from './impersonate-account-modal';
import {UpdateRolesModal} from "./update-roles-modal";

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

  constructor() {
    this.usersArray = [];
    this.skip = 0;
    this.sort = {key: 'username', direction:1};
    this.filter = "";
    Tracker.autorun((computation)=>{
      this.computation = computation;
      let subscriptionHandle =AccountsAdminTools.subscribeToPublication(this.currentFilter());
      if (subscriptionHandle.ready()) {
        let cursor:any = AccountsAdminTools.filteredUserQuery(Meteor.userId(), this.currentFilter()); // Cursor
        this.usersArray = cursor.fetch();
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
    DeleteAccountModal.openUser(user).subscribe(
      (payload:boolean)=> {
        if (payload) {
          this.computation.invalidate();
        }
      },
      (error)=>{
        CommonPopups.alert(error)
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
    UpdateRolesModal.openRoles().subscribe(
      (payload:boolean)=> {
        if (payload) {
          this.computation.invalidate();
        }
      },
      (error)=>{
        CommonPopups.alert(error)
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

  sort(key, direction) {
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

