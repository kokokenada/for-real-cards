import App = firebase.app.App;

import { IPayloadAction } from 'redux-package';
import {saveUserProfile} from './login-service-firebase';
import {
  IUser,
  IUploaderActionPayload,
  IUploaderState,
  LoginPackage,
  Tools,
  UploaderActions
} from 'common-app';

export class AvatarModel {

  db: firebase.database.Database;

  constructor(private firebase: App) {
    this.db = firebase.database();
  }
  watchForAvatarUploadMiddleWare = (state: IUploaderState) => next => (action: IPayloadAction) => {
    let payload: IUploaderActionPayload = action.payload;
    switch (action.type) {
      case UploaderActions.UPLOAD_SUCCESS: {
        const imageId = payload._idOfUploadedFile;
        console.log('avatar upload success. id = ' + imageId);
        this.db.ref('images/avatar/' + imageId).once('value', (snapshot) => {
          const imageInfo = snapshot.val();
          console.log(imageInfo)
          const currentUser: IUser = Tools.deepCopy( LoginPackage.lastLoginState.user );
          currentUser.profile['avatar-original'] = imageInfo.url;
          saveUserProfile(this.db, currentUser);
        });

      }
    }
    return next(action);
  }
}
