import { IPayloadAction } from 'redux-package';
import { UploaderActions } from './uploader-actions';
import {IUploaderActionPayload, IUploaderState} from './uploader-types'

const INITIAL_STATE:IUploaderState = {
  uploadInProgress: false,
  lastUploadSuccess: false,
  lastUploadErrorMessage: ''
};

export function uploaderReducer(
  state: IUploaderState = INITIAL_STATE,
  action: IPayloadAction): IUploaderState
{

  let payload:IUploaderActionPayload = action.payload;
  switch (action.type) {
    case UploaderActions.UPLOAD_START_REQUEST:
      return state; // NOOP
    case UploaderActions.UPLOAD_START_RESPONSE:
      return Object.assign({}, state, {uploader: payload.uploader});
    case UploaderActions.UPLOAD_STARTED:
      return Object.assign({}, state, {filename: payload.filename, uploadInProgress: true});
    case UploaderActions.UPLOAD_PROGRESS:
      return Object.assign({}, state, {filename: payload.filename, uploadInProgress: true, progressPercent:payload.progressPercent});
    case UploaderActions.UPLOAD_SUCCESS:
      return Object.assign({}, state, {uploadInProgress: false, lastUploadSuccess: true, lastUpload_id:payload._idOfUploadedFile, lastUploadErrorMessage:''});
    case UploaderActions.UPLOAD_FAIL:
      return Object.assign({}, state, {uploadInProgress: false, lastUploadSuccess: false, lastUploadErrorMessage:payload.error.message});
    default:
      return state;
  }
}

