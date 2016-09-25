import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../state.interface';


@Injectable()
export class AccountsAdminActions {
  private static prefix = 'CA_ACCT_ADMIN_';
  static DELETE_REQUEST = AccountsAdminActions.prefix + 'DELETE_REQUEST';
  static DELETE_SUCCEEDED = AccountsAdminActions.prefix + 'DELETE_SUCCESS';

  static IMPERSONATE_REQUEST = AccountsAdminActions.prefix + 'IMPERSONATE_REQUEST';
  static IMPERSONATE_SUCCEEDED = AccountsAdminActions.prefix + 'IMPERSONATE_SUCCEEDED';

  static USER_ROLE_CHANGE_REQUEST = AccountsAdminActions.prefix + 'USER_ROLE_CHANGE_REQUEST';
  static USER_ROLE_CHANGE_SUCCEEDED = AccountsAdminActions.prefix + 'USER_ROLE_CHANGE_SUCCEEDED';

  static SYSTEM_ROLE_CHANGE_REQUEST = AccountsAdminActions.prefix + 'SYSTEM_ROLE_CHANGE_REQUEST';
  static SYSTEM_ROLE_CHANGE_SUCCEEDED = AccountsAdminActions.prefix + 'SYSTEM_ROLE_CHANGE_SUCCEEDED';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  deleteRequest(userId:string):void {
    this.ngRedux.dispatch({ type: AccountsAdminActions.DELETE_REQUEST, payload: {userId}});
  }

  deleteSuceeded(userId:string):void {
    this.ngRedux.dispatch({ type: AccountsAdminActions.DELETE_SUCCEEDED, payload: {userId}});
  }

  impersonateRequest(userId:string):void {
    this.ngRedux.dispatch({ type: AccountsAdminActions.IMPERSONATE_REQUEST, payload: {userId}});
  }

  impersonateSuceeded(userId:string):void {
    this.ngRedux.dispatch({ type: AccountsAdminActions.IMPERSONATE_SUCCEEDED, payload: {userId}});
  }

  userRoleChangeRequest(userId:string, role:string, add:boolean):void {
    this.ngRedux.dispatch({ type: AccountsAdminActions.USER_ROLE_CHANGE_REQUEST, payload: {userId, role, add}});
  }

  userRoleChangeSuceeded(userId:string, role:string, add:boolean):void {
    this.ngRedux.dispatch({ type: AccountsAdminActions.USER_ROLE_CHANGE_SUCCEEDED, payload: {userId, role, add}});
  }

  systemRoleChangeRequest(role:string, add:boolean):void {
    this.ngRedux.dispatch({ type: AccountsAdminActions.SYSTEM_ROLE_CHANGE_REQUEST, payload: {role, add}});
  }

  systemRoleChangeSuceeded(role:string, add:boolean):void {
    this.ngRedux.dispatch({ type: AccountsAdminActions.SYSTEM_ROLE_CHANGE_SUCCEEDED, payload: {role, add}});
  }
}
