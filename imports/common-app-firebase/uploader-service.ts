import App = firebase.app.App;
import * as firebase from 'firebase';

import {Camera, File} from 'ionic-native';
declare let window: any; // Make TypeScript compiler stop complaining
declare let MeteorCameraUI;

import { UploaderActions, IUploaderService } from 'common-app';

export interface UploadFileInfo {
  _id: string;
  height?: number
  width?: number
}

export class UploaderServiceFirebase implements IUploaderService {
  db: firebase.database.Database;

  constructor(private firebase: App) {
    this.db = firebase.database();
  }

  private getStorageRef() {
    return this.firebase.storage().ref();
  }

  uploadFile(currentFile, collectionName: string): void {

    // create a record in collection to track image
    const imageCollectionRef = this.db.ref('images/' + collectionName + '/');
    const fileRef = imageCollectionRef.push() ;
    const id = fileRef.key;

    // Create the file metadata
    let metadata = {
      contentType: 'image/jpeg'
    };

// Upload file and metadata to the object 'images/mountains.jpg'
    let uploadTask = this.getStorageRef().child('images/' + collectionName + '/' + id).put(currentFile, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        UploaderActions.uploadProgress(currentFile.name, progress * 100);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function (error: any) {

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;


          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, function () {
        // Upload completed successfully, now we can get the download URL
        fileRef.set(
          {
            _id: id,
            url: uploadTask.snapshot.downloadURL,
            collectionName: collectionName
          }
        ).then( () => {
          UploaderActions.uploadSuccess(id);
        } );
      });


  }

  uploadImageFromCamera(collectionName: string, options = {
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
      MeteorCameraUI.getPicture({width: options.targetWidth, height: options.targetHeight}, (error, dataURL) => {

        if (error) {
          UploaderActions.uploadError(error);
        }

        const blob = MeteorCameraUI.dataURIToBlob(dataURL);
        blob.name = 'default';
        const file = _.pick(blob, 'name', 'type', 'size');

        //console.log('blob', blob, blob instanceof Blob);

      });
    }
  }

  static cancelUpload(uploader) {
    uploader.abort();
  }

}
