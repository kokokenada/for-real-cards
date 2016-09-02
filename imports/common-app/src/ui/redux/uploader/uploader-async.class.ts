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
  constructor(private actions: UploaderActions) {}

  startUpload = (action$: Observable<IPayloadAction>): Observable<IPayloadAction> => {
    return action$.filter(({ type }) => type === UploaderActions.UPLOAD_START)
      .flatMap(({ payload }) => {
        return Observable.fromPromise(UploaderService.uploadFile(payload.file, payload.store))
          .map((result)=> {
            return Observable.of({type: UploaderActions.UPLOAD_SUCCESS, payload: {_idOfUploadedFile: result._id}});
          })
          .catch((error)=> {
            return Observable.of({type: UploaderActions.UPLOAD_FAIL, payload: {error: error}})
          });
      });
  }
}
