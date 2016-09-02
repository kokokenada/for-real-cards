///<reference path='../../../../../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');

export interface IUploaderState {
  uploadInProgress:boolean;
  lastUploadSuccess?:boolean;
  lastUploadErrorMessage?:string;
  lastUpload_id?:string,
  filename?:string,
  progressPercent?: number
  uploader?:any;
}

export interface IUploaderActionPayload {
  file?:any; // TODO: Improve this with type definitions
  store?:any;
  uploader?:any;
  _idOfUploadedFile?:string;
  filename?: string,
  progressPercent?: number,
  error?:any;
}



