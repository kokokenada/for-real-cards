import 'meteor/jalik:ufs';
import 'meteor/okland:camera-ui'; declare let MeteorCameraUI;
import {Camera, File} from 'ionic-native';

declare let UploadFS: any;
declare let window: any; // Make TypeScript compiler stop complaining

import * as log from 'loglevel';
import {UploaderActions} from "./uploader-actions.class";

export interface UploadFileInfo {
  _id: string;
  height?: number
  width?: number
}

export class UploaderService {

  private static addToCommonUploaderOptions(options) {
    return Object.assign({},
      {
        adaptive: true,
        // Define the upload capacity (if upload speed is 1MB/s, then it will try to maintain upload at 80%, so 800KB/s)
        // (used only if adaptive = true)
        capacity: 0.8, // 80%
        // The size of each chunk sent to the server
        chunkSize: 8 * 1024, // 8k
        // The max chunk size (used only if adaptive = true)
        maxChunkSize: 128 * 1024, // 128k
        // This tells how many tries to do if an error occurs during upload
        maxTries: 5,

        onError: function (err) {
          UploaderActions.uploadError(err);
        },
        onAbort: function (file) {
          console.log(file.name + ' upload has been aborted');
        },
        onComplete: function (file) {
          UploaderActions.uploadSuccess(file._id);
        },
        onCreate: function (file) {
          console.log(file.name + ' has been created with ID ' + file._id);
        },
        onProgress: function (file, progress) {
          UploaderActions.uploadProgress(file.name, progress * 100);
        },
        onStart: function (file) {
          UploaderActions.uploadStarted(file.name);
        },
        onStop: function (file) {
          console.log(file.name + ' stopped');
        }
      }, options
    );
  }

  private static makeUploader(file, collection): any {
    // Prepare the file to insert in database, note that we don't provide an URL,
    // it will be set automatically by the uploader when file transfer is complete.
    let passedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      customField1: 1337,
      customField2: {
        a: 1,
        b: 2
      }
    };

    // Create a new Uploader for this file
    let uploader = new UploadFS.Uploader(
      UploaderService.addToCommonUploaderOptions(
        {
          // This is where the uploader will save the file
          store: collection,
          // The File/Blob object containing the data
          data: file,
          // The document to save in the collection
          file: passedFile,
          // The error callback
        })
    );
    return uploader;
  }

  static uploadFileRequest(currentFile, collection): void {
    let uploader = UploaderService.makeUploader(currentFile, collection);
    UploaderActions.uploadStartResponse(uploader);
    uploader.start();
  }

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
  }): void {
    if (!Meteor.isCordova) {
      UploaderActions.uploadError('This is a cordova only function');
    } else {
      MeteorCameraUI.getPicture({ width: options.targetWidth, height: options.targetHeight }, (error, dataURL) => {

        if (error) {
          UploaderActions.uploadError(error);
        }

        const blob = MeteorCameraUI.dataURIToBlob(dataURL);
        blob.name = 'default';
        const file = _.pick(blob, 'name', 'type', 'size');

        //console.log('blob', blob, blob instanceof Blob);

        const uploader = new UploadFS.Uploader(UploaderService.addToCommonUploaderOptions({
          data: blob,
          file: file,
          store: collection
        }));

        uploader.start();
        UploaderActions.uploadStartResponse(uploader);

      });
    }
  }

  static cancelUpload(uploader) {
    uploader.abort();
  }

}
