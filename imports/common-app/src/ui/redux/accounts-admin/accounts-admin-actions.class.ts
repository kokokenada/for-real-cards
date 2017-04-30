import {ReduxPackageCombiner} from "redux-package";

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

  static deleteRequest(userId:string):void {
    ReduxPackageCombiner.dispatch({ type: AccountsAdminActions.DELETE_REQUEST, payload: {userId}});
  }

  static deleteSuceeded(userId:string):void {
    ReduxPackageCombiner.dispatch({ type: AccountsAdminActions.DELETE_SUCCEEDED, payload: {userId}});
  }

  static impersonateRequest(userId:string):void {
    ReduxPackageCombiner.dispatch({ type: AccountsAdminActions.IMPERSONATE_REQUEST, payload: {userId}});
  }

  static impersonateSuceeded(userId:string):void {
    ReduxPackageCombiner.dispatch({ type: AccountsAdminActions.IMPERSONATE_SUCCEEDED, payload: {userId}});
  }

  static userRoleChangeRequest(userId:string, role:string, add:boolean):void {
    ReduxPackageCombiner.dispatch({ type: AccountsAdminActions.USER_ROLE_CHANGE_REQUEST, payload: {userId, role, add}});
  }

  static userRoleChangeSuceeded(userId:string, role:string, add:boolean):void {
    ReduxPackageCombiner.dispatch({ type: AccountsAdminActions.USER_ROLE_CHANGE_SUCCEEDED, payload: {userId, role, add}});
  }

  static systemRoleChangeRequest(role:string, add:boolean):void {
    ReduxPackageCombiner.dispatch({ type: AccountsAdminActions.SYSTEM_ROLE_CHANGE_REQUEST, payload: {role, add}});
  }

  static systemRoleChangeSuceeded(role:string, add:boolean):void {
    ReduxPackageCombiner.dispatch({ type: AccountsAdminActions.SYSTEM_ROLE_CHANGE_SUCCEEDED, payload: {role, add}});
  }
}
