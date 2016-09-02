import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import { uploaderReducer} from "./uploader-reducer";
import { UploaderAsync} from "./uploader-async.class";
import {IAppState} from "../state.interface";
import { UploaderActions} from "./uploader-actions.class";

@Injectable()
export class UploaderModule extends ReduxModule<IAppState>  {
  reducer=uploaderReducer;

  constructor(private uploaderEpics:UploaderAsync, public actions:UploaderActions) {
    super();
    this.epics.push(uploaderEpics.startUpload);
  }

  initialize():void {
  }
}