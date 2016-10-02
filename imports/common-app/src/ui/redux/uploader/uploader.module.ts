import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import { uploaderReducer} from "./uploader-reducer";
import { UploaderAsync} from "./uploader-async.class";
import { IAppState } from "../state.interface";
import { IPayloadAction } from "../action.interface";
import { UploaderActions} from "./uploader-actions.class";

@Injectable()
export class UploaderModule extends ReduxModule<IAppState, IPayloadAction>  {
  reducer={name:'uploaderReducer', reducer: uploaderReducer};
  actions = UploaderActions;
  constructor(private uploaderEpics:UploaderAsync) {
    super();
    this.epics.push(
      uploaderEpics.startUpload,
      uploaderEpics.cameraUpload
    );
  }

  initialize():void {
  }
}