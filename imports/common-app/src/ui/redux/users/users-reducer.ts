///<reference path='../../../../../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');
import { IPayloadAction } from 'redux-package';
import { UsersActions } from './users-actions';
import {IUsersActionPayload, IUsersState  } from './users-types'
import { IUser, IDocumentChange, EDocumentChangeType, ReduxModuleUtil} from 'common-app';

const INITIAL_STATE:IUsersState = {
  users: Immutable.Map<string, IUser>()
};

export function usersReducer(
  state: IUsersState = INITIAL_STATE,
  action: IPayloadAction): IUsersState
{

  let payload:IUsersActionPayload = action.payload;
  switch (action.type) {
    case UsersActions.READ_BATCH_RESPONSE:
      return {users: ReduxModuleUtil.arrayToMap<IUser>(payload.users) };
    case UsersActions.CHANGE:
      let changeDoc:IDocumentChange<IUser>=payload.documentChange;
      switch (changeDoc.changeType) {
        case (EDocumentChangeType.NEW): // Fall through
        case (EDocumentChangeType.CHANGED):
          return {users: state.users.set(changeDoc.newDocument._id, changeDoc.newDocument) };
        case (EDocumentChangeType.REMOVED):
          return {users: state.users.delete(changeDoc.oldDocument._id) };
        default:
          return state;
      }
    default:
      return state;
  }
}

