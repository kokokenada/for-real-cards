import { ReduxPackage, IAppState, IPayloadAction} from 'redux-package';
import { uploaderReducer} from "./uploader-reducer";
import { UploaderAsync} from "./uploader-async";
import { UploaderActions} from "./uploader-actions";
import {IUploaderService} from './uploader-service-interface';

export const UPLOADED_PACKAGE_NAME = 'ca_uploaded';

export class UploaderPackage extends ReduxPackage<IAppState, IPayloadAction>  {
  reducers=[{name:UPLOADED_PACKAGE_NAME, reducer: uploaderReducer}];
  actions = UploaderActions;
  constructor(private service:IUploaderService) {
    super();
    const uploaderEpics = new UploaderAsync(service);
    this.epics.push(
      uploaderEpics.startUpload,
      uploaderEpics.cameraUpload
    );
  }
}