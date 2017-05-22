import { IPayloadAction  } from 'redux-package';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { UploaderActions } from "./uploader-actions";
import {IUploaderService} from './uploader-service-interface';

export class UploaderAsync {
  constructor(private service: IUploaderService) {

  }
  startUpload = (action$: Observable<IPayloadAction>): Observable<IPayloadAction> => {
    return action$.filter(({ type }) => type === UploaderActions.UPLOAD_START_REQUEST)
      .do(({ payload }) => {
        this.service.uploadFile(payload.file, payload.store);
      })
      .map( ()=> { return {type:'NOOP'}}); // Don't return self. If you do, race condition occrus
  };

  cameraUpload = (action$: Observable<IPayloadAction>): Observable<IPayloadAction> => {
    return action$.filter(({ type }) => type === UploaderActions.UPLOAD_CAMERA_PIC_REQUEST)
      .do(({ payload }) => {
        this.service.uploadImageFromCamera(payload.store);
      })
      .map( ()=> { return {type:'NOOP'}}); // Don't return self. If you do, race condition occrus
  };
}
