import { Camera } from 'ionic-native';
import * as log from 'loglevel';

import {Uploader} from "../../api/services/uploader";
declare let WebAppLocalServer:any;

export class CameraTools {
  static uploadImageFromCamera(collection, options = {
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    allowEdit: true,
    encodingType: Camera.EncodingType.PNG,
    targetWidth: 100,
    targetHeight: 100,
//    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false,
    correctOrientation: true
  }):Promise {
    return new Promise((resolve, reject)=> {
      if (!Meteor.isCordova) {
        reject('This is a cordova only function');
      } else {
        Camera.getPicture(options).then(
          (imageFile)=> {
            console.log('camera success')
            console.log(imageFile)
            imageFile=WebAppLocalServer.localFileSystemUrl(imageFile);
            console.log(imageFile)
            Uploader.uploadFileURI(imageFile, collection).then(
              (result)=> {
                resolve(result);
              }, (error)=> {
                log.error(error);
                reject(error);
              }
            );

              
/*            Uploader.uploadFile(imageFile, collection).then(
              (result)=> {
                resolve(result);
              }, (error)=> {
                log.error(error);
                reject(error);
              }
            );
            */
            /*
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
             );*/
          }, (error)=> {
            log.error(error);
            reject(error);
          });
      }
    });
  }


}
