import { IPayloadAction, ReduxPackageCombiner} from "redux-package";
import {IDocumentChange, IUser} from 'common-app';

export class UsersActions {
  private static prefix = 'CA_USERS/';
  static READ_BATCH_REQUEST = UsersActions.prefix + 'READ_REQ';
  static READ_BATCH_RESPONSE = UsersActions.prefix + 'READ_RESP';
  static WATCH = UsersActions.prefix + 'WATCH';
  static CHANGE = UsersActions.prefix + 'CHANGE';

  static read():void {
    ReduxPackageCombiner.dispatch({ type: UsersActions.READ_BATCH_REQUEST});
  }

  static watch():void {
    ReduxPackageCombiner.dispatch({type: UsersActions.WATCH});
  }

  static dispatchChange(documentChange:IDocumentChange<IUser>) {
    ReduxPackageCombiner.dispatch(UsersActions.changeFactory(documentChange));
  }

  static changeFactory(documentChange:IDocumentChange<IUser>):IPayloadAction {
    return {type: UsersActions.CHANGE, payload: {documentChange:documentChange}};
  }
}