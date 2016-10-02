import {ReduxModuleCombiner} from "../redux-module-combiner";

export class UploaderActions {
  private static prefix = 'CA_UPLOADER_';
  static UPLOAD_START_REQUEST = UploaderActions.prefix + 'UPLOAD_START_REQUEST';
  static UPLOAD_START_RESPONSE = UploaderActions.prefix + 'UPLOAD_START_RESPONSE';
  static UPLOAD_STARTED = UploaderActions.prefix + 'UPLOAD_STARTED';
  static UPLOAD_PROGRESS = UploaderActions.prefix + 'UPLOAD_PROGRESS';
  static UPLOAD_SUCCESS = UploaderActions.prefix + 'UPLOAD_SUCCESS';
  static UPLOAD_FAIL = UploaderActions.prefix + 'UPLOAD_FAIL';
  static UPLOAD_CAMERA_PIC_REQUEST = UploaderActions.prefix + 'UPLOAD_CAMERA_PIC_REQUEST';

  static uploadStartRequest(file, store):void { // TODO: Improve this with some type definitions
    ReduxModuleCombiner.ngRedux.dispatch({ type: UploaderActions.UPLOAD_START_REQUEST, payload: {file:file, store:store}});
  }

  static uploadStartResponse(uploader):void { // TODO: Improve this with some type definitions
    ReduxModuleCombiner.ngRedux.dispatch({ type: UploaderActions.UPLOAD_START_RESPONSE, payload: {uploader:uploader}});
  }

  static uploadStarted(filename:string):void {
    ReduxModuleCombiner.ngRedux.dispatch({ type: UploaderActions.UPLOAD_STARTED, payload: {filename:filename}});
  }

  static uploadProgress(filename:string, progressPercent:number) {
    ReduxModuleCombiner.ngRedux.dispatch({ type: UploaderActions.UPLOAD_PROGRESS, payload: {filename:filename, progressPercent:progressPercent}});
  }

  static uploadSuccess(_idOfUploadedFile:string) {
    ReduxModuleCombiner.ngRedux.dispatch({ type: UploaderActions.UPLOAD_SUCCESS, payload: {_idOfUploadedFile:_idOfUploadedFile}});
  }

  static uploadCameraPicRequest(store):void { // TODO: Improve this with some type definitions
    ReduxModuleCombiner.ngRedux.dispatch({ type: UploaderActions.UPLOAD_CAMERA_PIC_REQUEST, payload: {store:store}});
  }

  static uploadError(errorMessage:string):void {
    ReduxModuleCombiner.ngRedux.dispatch({ type: UploaderActions.UPLOAD_FAIL, payload: {lastUploadErrorMessage:errorMessage}});
  }
}