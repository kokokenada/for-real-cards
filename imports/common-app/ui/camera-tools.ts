import {Camera, File} from 'ionic-native';
import * as log from 'loglevel';

import {Uploader} from "./index";
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
            File.checkFile(imageFile, '').then(
              (result)=> {
                console.log('checkFile')
                console.log(result)
                Uploader.uploadFileURI(imageFile, collection).then(
                  (result)=> {
                    resolve(result);
                  }, (error)=> {
                    log.error(error);
                    reject(error);
                  }
                );
              },
              (error)=>{
                console.error(error)
              }
            );
          }, (error)=> {
            log.error(error);
            reject(error);
          });
      }
    });
  }


}
