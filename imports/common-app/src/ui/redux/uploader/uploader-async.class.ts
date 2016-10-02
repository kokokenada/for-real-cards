import { Injectable } from '@angular/core';
import { IPayloadAction  } from '../action.interface';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { UploaderService } from "./uploader.service";
import { UploaderActions } from "./uploader-actions.class";

@Injectable()
export class UploaderAsync {

  startUpload = (action$: Observable<IPayloadAction>): Observable<IPayloadAction> => {
    return action$.filter(({ type }) => type === UploaderActions.UPLOAD_START_REQUEST)
      .do(({ payload }) => {
        UploaderService.uploadFileRequest(payload.file, payload.store);
      })
      .map( ()=> { return {type:'NOOP'}}); // Don't return self. If you do, race condition occrus
  };

  cameraUpload = (action$: Observable<IPayloadAction>): Observable<IPayloadAction> => {
    return action$.filter(({ type }) => type === UploaderActions.UPLOAD_CAMERA_PIC_REQUEST)
      .do(({ payload }) => {
        UploaderService.uploadImageFromCamera(payload.store);
      })
      .map( ()=> { return {type:'NOOP'}}); // Don't return self. If you do, race condition occrus
  };
}
