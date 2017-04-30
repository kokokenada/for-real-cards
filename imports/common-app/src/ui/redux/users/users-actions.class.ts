import { IPayloadAction, ReduxPackageCombiner} from "redux-package";
import {IDocumentChange} from "../../reactive-data/document-change.interface";
import { User } from "../../../../../common-app-api/src/api/models/user.model";

export class UsersActions {
  private static prefix = 'CA_USERS_';
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

  static changeFactory(documentChange:IDocumentChange<User>):IPayloadAction {
    return {type: UsersActions.CHANGE, payload: {documentChange:documentChange}};
  }
}