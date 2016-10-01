import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState } from '../state.interface';
import { IPayloadAction} from "../action.interface";
import {IDocumentChange} from "../../reactive-data/document-change.interface";
import { User } from "../../../../../common-app-api/src/api/models/user.model";

@Injectable()
export class UsersActions {
  private static prefix = 'CA_USERS_';
  static READ_BATCH_REQUEST = UsersActions.prefix + 'READ_REQ';
  static READ_BATCH_RESPONSE = UsersActions.prefix + 'READ_RESP';
  static WATCH = UsersActions.prefix + 'WATCH';
  static CHANGE = UsersActions.prefix + 'CHANGE';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  read():void {
    this.ngRedux.dispatch({ type: UsersActions.READ_BATCH_REQUEST});
  }

  watch():void {
    this.ngRedux.dispatch({type: UsersActions.WATCH});
  }

  static changeFactory(documentChange:IDocumentChange<User>):IPayloadAction {
    return {type: UsersActions.CHANGE, payload: {documentChange:documentChange}};
  }
}