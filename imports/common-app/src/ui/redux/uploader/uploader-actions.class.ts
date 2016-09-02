import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';


import { IAppState } from '../state.interface';


@Injectable()
export class UploaderActions {
  private static prefix = 'CA_UPLOADER_';
  static UPLOAD_START_REQUEST = UploaderActions.prefix + 'UPLOAD_START_REQUEST';
  static UPLOAD_START_RESPONSE = UploaderActions.prefix + 'UPLOAD_START_RESPONSE';
  static UPLOAD_STARTED = UploaderActions.prefix + 'UPLOAD_STARTED';
  static UPLOAD_PROGRESS = UploaderActions.prefix + 'UPLOAD_PROGRESS';
  static UPLOAD_SUCCESS = UploaderActions.prefix + 'UPLOAD_SUCCESS';
  static UPLOAD_FAIL = UploaderActions.prefix + 'UPLOAD_FAIL';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  uploadStartRequest(file, store):void { // TODO: Improve this with some type definitions
    this.ngRedux.dispatch({ type: UploaderActions.UPLOAD_START_REQUEST, payload: {file:file, store:store}});
  }

  uploadStartResponse(uploader):void { // TODO: Improve this with some type definitions
    this.ngRedux.dispatch({ type: UploaderActions.UPLOAD_START_RESPONSE, payload: {uploader:uploader}});
  }

  uploadStarted(filename:string):void {
    this.ngRedux.dispatch({ type: UploaderActions.UPLOAD_STARTED, payload: {filename:filename}});
  }

  uploadProgress(filename:string, progressPercent:number) {
    this.ngRedux.dispatch({ type: UploaderActions.UPLOAD_PROGRESS, payload: {filename:filename, progressPercent:progressPercent}});
  }

  uploadSuccess(_idOfUploadedFile:string) {
    this.ngRedux.dispatch({ type: UploaderActions.UPLOAD_SUCCESS, payload: {_idOfUploadedFile:_idOfUploadedFile}});
  }

/*  static changeFactory(documentChange:IDocumentChange<User>):IPayloadAction {
    return {type: UsersActions.CHANGE, payload: {documentChange:documentChange}};
  }*/
}