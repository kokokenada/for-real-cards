
import 'meteor/jalik:ufs';
import {Camera, File} from 'ionic-native';

declare let UploadFS:any;
declare let window:any; // Make TypeScript compiler stop complaining

import * as log from 'loglevel';
import {UploaderActions} from "./uploader-actions.class";

export interface UploadFileInfo {
  _id:string;
  height?:number
  width?:number
}

export class UploaderService {

  /**
   * Converts DataURL to Blob object
   *
   * https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
   *
   * @param  {String} dataURL
   * @return {Blob}
   */
  private static dataURLToBlob(dataURL):any {
    const BASE64_MARKER = ';base64,';

    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {type: contentType});
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
  }

  /**
   * Converts Blob object to ArrayBuffer
   *
   * @param  {Blob}       blob          Source file
   * @param  {Function}   callback      Success callback with converted object as a first argument
   * @param  {Function}   errorCallback Error callback with error as a first argument
   */
  static blobToArrayBuffer(blob, callback, errorCallback) {
    let reader = new FileReader();

    reader.onload = (e:any) => {
      callback(e.target.result);
    };

    reader.onerror = (e) => {
      if (errorCallback) {
        errorCallback(e);
      }
    };

    reader.readAsArrayBuffer(blob);

  }

  /**
   * Uploads a new file
   *
   * @param  {String}   dataUrl [description]
   * @param  {String}   name    [description]
   * @param  {Collection} collection
   * @param  {Function} resolve [description]
   * @param  {Function} reject  [description]
   */
  private static uploadDataUrl(dataUrl, name, collection, resolve, reject) {
    // convert to Blob
    let blob = UploaderService.dataURLToBlob(dataUrl);
    blob.name = name;

    // pick from an object only: name, type and size
    const file = _.pick(blob, 'name', 'type', 'size');

    // convert to ArrayBuffer
    UploaderService.blobToArrayBuffer(blob, (data) => {
      const upload = new UploadFS.Uploader({
        data,
        file,
        store: collection,
        onError: reject,
        onComplete: resolve
      });

      upload.start();
    }, reject);
  }

  private static uploadFileURI(file, collection):Promise<any> {
    return new Promise( (resolve, reject)=>{
      console.log("in uploadFileURI reading " + file)

      window.resolveLocalFileSystemURL(file, (entry)=>{
        /*        var reader = new FileReader();
         reader.onload = function (ev) {
         console.log('file reader onload in uploadFileURI')
         console.log(ev)
         };*/
        entry.file( (f)=>{
          console.log('entry.file( (f)')
          console.log(f)

          var reader:any = new FileReader();
          reader = reader.__zone_symbol__originalInstance; // Why on earth do I need to do this???

          reader.onload = (ev:any)=> {
            console.log('reader.onload')
            console.log(ev)
            const uploader = new UploadFS.Uploader({
              store: collection,
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
              // The file data
              file:f,

              data: ev.target.result,
              onError: function (err) {
                console.error(err);
              },
              onAbort: function (file) {
                console.log(file.name + ' upload has been aborted');
              },
              onComplete: function (file) {
                console.log(file.name + ' has been uploaded');
              },
              onCreate: function (file) {
                console.log(file.name + ' has been created with ID ' + file._id);
              },
              onProgress: function (file, progress) {
                console.log(file.name + ' ' + (progress*100) + '% uploaded');
              },
              onStart: function (file) {
                console.log(file.name + ' started');
              },
              onStop: function (file) {
                console.log(file.name + ' stopped');
              }

            });
            uploader.start();


          };
          reader.onerror = (e)=>{
            log.error('FilerReader error');
            log.error(e);
            reject(e);
          }
          reader.onabort = (e)=> {
            log.info('FilerReader abort');
            reject(e);
          }
          reader.onloadstart = (o)=>{
            log.debug('FilerReader onloadstart');
          }
          reader.onloadend = (o)=>{
            log.debug('FilerReader onloadend');
          }

          reader.readAsArrayBuffer(f);



        });

      });

      /*
       var reader = new FileReader();
       reader.onload = function (ev) {
       console.log('file reader onload in uploadFileURI')
       console.log(ev)
       };
       reader.readAsDataURL(file);
       */

    });
  }


  private static makeUploader (file, collection, uploaderActions:UploaderActions):any {
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
    let uploader = new UploadFS.Uploader({
      // This is where the uploader will save the file
      store: collection,
      // Optimize speed transfer by increasing/decreasing chunk size automatically
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
      // The File/Blob object containing the data
      data: file,
      // The document to save in the collection
      file: passedFile,
      // The error callback
      onError: function (err) {
        console.error(err);
      },
      onAbort: function (file) {
        console.log(file.name + ' upload has been aborted');
      },
      onComplete: function (file) {
        uploaderActions.uploadSuccess(file._id);
      },
      onCreate: function (file) {
        console.log(file.name + ' has been created with ID ' + file._id);
      },
      onProgress: function (file, progress) {
        uploaderActions.uploadProgress(file.name, progress);
      },
      onStart: function (file) {
        uploaderActions.uploadStarted(file.name);
      },
      onStop: function (file) {
        console.log(file.name + ' stopped');
      },
    });
    return uploader;
  }

  static uploadFileRequest(currentFile, collection, actions:UploaderActions):void{
    let uploader = UploaderService.makeUploader(currentFile, collection, actions);
    actions.uploadStartResponse(uploader);
    uploader.start();
  }

  static cancelUpload(uploader) {
    uploader.abort();
  }



  static uploadFileOLD(currentFile, collection):Promise<any>{
    return new Promise( (resolve, reject)=>{
      log.debug('uploadFileRequest');
      let reader = new FileReader();
      let dataURL:any;
//    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
      reader.onload = (e:any) => {
        console.log('onload')
        console.log(e)
        dataURL = dataURL = reader.result;
        UploaderService.uploadDataUrl(  //TODO: Upload file in chunks to void this memory intensive approach
          dataURL,
          currentFile.name,
          collection,
          (result) => {
            resolve(result);
          }, (error) => {
            reject(error);
          }
        );
      };
      reader.onloadend = (e:any)=>{
        console.log('onloadend')
        console.log(e)
      }
      reader.readAsDataURL(currentFile);
    });
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
  }):Promise<any> {
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
                UploaderService.uploadFileURI(imageFile, collection).then(
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
