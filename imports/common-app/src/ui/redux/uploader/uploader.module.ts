import {Injectable} from "@angular/core";

import { ReduxPackage, IAppState, IPayloadAction} from 'redux-package';
import { uploaderReducer} from "./uploader-reducer";
import { UploaderAsync} from "./uploader-async.class";
import { UploaderActions} from "./uploader-actions.class";

@Injectable()
export class UploaderModule extends ReduxPackage<IAppState, IPayloadAction>  {
  reducers=[{name:'uploaderReducer', reducer: uploaderReducer}];
  actions = UploaderActions;
  constructor(private uploaderEpics:UploaderAsync) {
    super();
    this.epics.push(
      uploaderEpics.startUpload,
      uploaderEpics.cameraUpload
    );
  }
}