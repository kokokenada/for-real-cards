/**
 * Created by kenono on 2016-05-16.
 */
import {Uploader, UploadFileInfo} from "./uploader";
import {AvatarCollection} from "../models/avatar.model";
import {AccountTools, UserEvent, UserEventType} from "./account-tools";

import * as log from 'loglevel';

export class AvatarTools {



  static imageFromCamere():void {
    if (Meteor.isCordova) {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };
      let $cordovaCamera:any = {}; //TODO
      $cordovaCamera.getPicture(options)
        .then(function (imageFile) {
          window.resolveLocalFileSystemURL(imageFile,
            function (fileEntry) {
              fileEntry.file(function (file) {
                let uploader = new Uploader();
                uploader.upload(file, AvatarCollection, 'avatar-images-byId', {userId: Meteor.userId()}).subscribe(
                  (result:UploadFileInfo[])=>AvatarTools.updateProfileAvatar(result)
                  , (reason)=> {
                    if (reason)
                      CommonPopups.alert(reason)
                  }
                );
              }, function (error) {
                log.error(error);
                CommonPopups.alert(error);
              });
            },
            function (evt) { //error}
              let errorString = 'Error accessing file system: ' + evt.target.error.code;
              log.error(errorString);
              CommonPopups.alert(Meteor.Error('error-obtaining-file', errorString));
            }
          );
        }, function (error) {
          log.error(error);
          CommonPopups.alert(error);
        });
    }
  }

  static updateProfileAvatar(result:UploadFileInfo[]) {
    if (result && result.length > 0) {
      let userId:string = Meteor.userId();
      let currentAvatar:string = Meteor.user().profile.avatar_id;
      if (currentAvatar) {
        log.debug('removing currentAvatar:' + currentAvatar);
        AvatarCollection.remove(currentAvatar);
      }
      if (result.length > 1) {
        log.warn("Only one image required.  Using first.");
      }
      let _id = result[0]._id;
      Meteor.users.update(userId, {$set: {"profile.avatar_id": _id}}, (error, numberAffected)=>{
        if (error) {
          log(error);
        } else {
          Tracker.autorun(()=>{
            let subscriptionHandle = Meteor.subscribe('common.avatar-images', _id);
            let avatarObject = AvatarCollection.findOne({_id: _id});
            if (avatarObject && avatarObject.imageReady) {
              let user = Meteor.user();
              user.profile.avatar_id = result[0]._id;
              AccountTools.pushAvatarValue(user);
              subscriptionHandle.stop();
            }
          });
        }
      });
    }
  }


}