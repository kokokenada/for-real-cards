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
  static UPLOAD_CAMERA_PIC_REQUEST = UploaderActions.prefix + 'UPLOAD_CAMERA_PIC_REQUEST';

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

  uploadCameraPicRequest(store):void { // TODO: Improve this with some type definitions
    this.ngRedux.dispatch({ type: UploaderActions.UPLOAD_CAMERA_PIC_REQUEST, payload: {store:store}});
  }

  uploadError(errorMessage:string):void {
    this.ngRedux.dispatch({ type: UploaderActions.UPLOAD_FAIL, payload: {lastUploadErrorMessage:errorMessage}});
  }
}