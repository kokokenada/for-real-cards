import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState } from '../state.interface';


@Injectable()
export class UploaderActions {
  private static prefix = 'CA_UPLOADER_';
  static UPLOAD_START = UploaderActions.prefix + 'UPLOAD_START';
  static UPLOAD_SUCCESS = UploaderActions.prefix + 'UPLOAD_SUCCESS';
  static UPLOAD_FAIL = UploaderActions.prefix + 'UPLOAD_FAIL';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  uploadFile(file, store):void { // TODO: Improve this with some type definitions
    this.ngRedux.dispatch({ type: UploaderActions.UPLOAD_START, payload: {file:file, store:store}});
  }

/*  static changeFactory(documentChange:IDocumentChange<User>):IPayloadAction {
    return {type: UsersActions.CHANGE, payload: {documentChange:documentChange}};
  }*/
}