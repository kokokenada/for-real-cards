///<reference path='../../../../../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');
import { IPayloadAction } from '../action.interface';
import { UploaderActions } from './uploader-actions.class';
import {IUploaderActionPayload, IUploaderState} from './uploader.types'

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
    case UploaderActions.UPLOAD_START:
      return Object.assign({}, state, {uploadInProgress: true});
    case UploaderActions.UPLOAD_SUCCESS:
      return Object.assign({}, state, {uploadInProgress: false, lastUploadSuccess: true, lastUpload_id:payload._idOfUploadedFile, lastUploadErrorMessage:''});
    case UploaderActions.UPLOAD_FAIL:
      return Object.assign({}, state, {uploadInProgress: false, lastUploadSuccess: false, lastUploadErrorMessage:payload.error.message});
    default:
      return state;
  }
}

