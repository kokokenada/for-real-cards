/**
 * Created by kenono on 2016-05-16.
 */
import {Uploader, UploadFileInfo} from "./uploader";
import {AccountTools} from "./account-tools";
import { User } from "../models/user.model";
import {AvatarOriginalCollection, AvatarMediumCollection, AvatarThumbCollection} from "../models/avatar.model"
import * as log from 'loglevel';
import {Meteor} from 'meteor/meteor';

export class AvatarTools {
/*
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
*/
/* CollectionFS Related  
static updateProfileAvatar(result:UploadFileInfo[]) {
    if (result && result.length > 0) {
      let userId:string = Meteor.userId();
      let currentAvatar:string = Meteor.user().profile.avatar_id;
      if (currentAvatar) {
        log.debug('removing currentAvatar:' + currentAvatar);
        AvatarOriginalCollection.remove(currentAvatar);
      }
      if (result.length > 1) {
        log.warn("Only one image required.  Using first.");
      }
      let _id = result[0]._id;
      Meteor.users.update(userId, {$set: {"profile.avatar_id": _id}}, (error, numberAffected)=> {
        if (error) {
          log(error);
        } else {
          Tracker.autorun(()=> {
            let subscriptionHandle = Meteor.subscribe('common.avatar-images', _id);
            let avatarObject = AvatarOriginalCollection.findOne({_id: _id});
            if (avatarObject && avatarObject.imageReady) {
              let user = Meteor.user();
              user.profile.avatar_id = result[0]._id;
              UserEvent.pushAvatarValue(user);
              subscriptionHandle.stop();
            }
          });
        }
      });
    }
  }
*/

  static getAvatarURL(user:User, size:string="thumb"):string {
    if (!user) {
      return AvatarTools.defaultAvatarUrl();
    }
    let profile = user.profile;
    if (!profile)
      return AvatarTools.defaultAvatarUrl();

/*    if (size!=='original') {
      size="original";
      log.warn("Using original size to work work around no gm in production");
    }*/
    let file = profile['avatar-' + size];
    if (!file) {
      file = profile['avatar-medium'];
    }
    if (!file) {
      return AvatarTools.defaultAvatarUrl();
    }
    return file;
  }

  static defaultAvatarUrl() {
    return Meteor.absoluteUrl('default-avatar.png');
  };

}