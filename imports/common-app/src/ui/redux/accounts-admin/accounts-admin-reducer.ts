import { IPayloadAction } from '../action.interface';
import { AccountsAdminActions } from './accounts-admin-actions.class';
import {IAccountsAdminActionPayload, IAccountsAdminState} from './accounts-admin.types'

const INITIAL_STATE:IAccountsAdminState = {
  requestInprogress: false
};

export function accountsAdminReducer(
  state: IAccountsAdminState = INITIAL_STATE,
  action: IPayloadAction): IAccountsAdminState
{

  let payload:IAccountsAdminActionPayload = action.payload;
  switch (action.type) {
    case AccountsAdminActions.DELETE_REQUEST:
      return Object.assign({}, state, {requestInprogress: true});
    case AccountsAdminActions.DELETE_SUCCEEDED:
      return Object.assign({}, state, {requestInprogress: false});
    default:
      return state;
  }
}

