import { Injectable } from '@angular/core';
import { IPayloadAction  } from '../action.interface';

import { AccountsAdminService } from "./accounts-admin.service";
import { AccountsAdminActions } from "./accounts-admin-actions.class";
import {IAccountsAdminActionPayload, IAccountsAdminState} from "./accounts-admin.types";

@Injectable()
export class AccountsAdminAsync {
  constructor(private actions: AccountsAdminActions, private accountsAdminService: AccountsAdminService) {
  }
  // TODO: Error hanlding
  modalMiddleware = (state: IAccountsAdminState) => next => (action: IPayloadAction) => {
    let payload: IAccountsAdminActionPayload = action.payload;
    switch (action.type) {
      case AccountsAdminActions.DELETE_REQUEST: {
        this.accountsAdminService.deleteAccount(payload.userId).then(
          ()=> {
            this.actions.deleteSuceeded(payload.userId);
          }
        );
        break;
      }
      case AccountsAdminActions.IMPERSONATE_REQUEST: {
        this.accountsAdminService.impersonate(payload.userId).then(
          ()=> {
            this.actions.impersonateSuceeded(payload.userId);
          }
        );
        break;
      }
      case AccountsAdminActions.USER_ROLE_CHANGE_REQUEST: {
        if (payload.add) {
          this.accountsAdminService.addUserRole(payload.userId, payload.role).then(
            ()=> {
              this.actions.userRoleChangeSuceeded(payload.userId, payload.role, payload.add);
            }
          );
        } else {
          this.accountsAdminService.removeUserRole(payload.userId, payload.role).then(
            ()=> {
              this.actions.userRoleChangeSuceeded(payload.userId, payload.role, payload.add);
            }
          );
        }
        break;
      }
      case AccountsAdminActions.SYSTEM_ROLE_CHANGE_REQUEST: {
        if (payload.add) {
          this.accountsAdminService.addRole(payload.role).then(
            ()=> {
              this.actions.systemRoleChangeSuceeded(payload.role, payload.add);
            }
          );
        } else {
          this.accountsAdminService.removeRole(payload.role).then(
            ()=> {
              this.actions.systemRoleChangeSuceeded(payload.role, payload.add);
            }
          );
        }
        break;
      }
    }
    return next(action);
  }
}
