/**
 * Created by kenono on 2016-04-21.
 */
import {NgZone} from '@angular/core'
import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor';
import { Subject, Subscription} from 'rxjs'
import 'meteor/jalik:ufs'; declare let UploadFS:any;

import * as log from 'loglevel';

export interface UploadFileInfo {
  _id:string;
  height?:number
  width?:number
}

export class Uploader {
/*  private fsCollection:Mongo.Collection;
  private properties;
  private subscription:string;
  private intervalHandle;
  private serverWaits = 0;
  private ids:string[];*/
  private subject:Subject;

  constructor() {
    this.subject = new Subject();
  }
/*
  private checkIfDone() {
    let progress = FS.HTTP.uploadQueue.progress();

    if (progress === 100 || this.serverWaits > 0) {
      Meteor.clearInterval(this.intervalHandle);
      this.intervalHandle = null;
      Meteor.subscribe(this.subscription, this.ids, new Date().toString(), {
          onStop: (error)=> {
            if (error) {
              log.error(error);
              this.subject.error(error);
            }
          },
          onReady: ()=> {
            var filesRead = this.fsCollection.find({_id: {$in: this.ids}}).fetch();
            var result:UploadFileInfo[] = [];
            var retrying = false;

            _.each(filesRead, (file)=> {
              if (!file.width) {
                // Server not finished processing image.
                this.serverWaits++;
                if (this.serverWaits > 30) {
                  log.error('Could process file:');
                  log.error = (file);
                  // fall through
                } else {
                  // exit
                  log.info('waiting for image size. serverWaits:' + this.serverWaits);
                  this.intervalHandle = Meteor.setInterval(()=> {
                    this.checkIfDone()
                  }, 333);
                  retrying = true;
                }
              }
              result.push(
                {
                  _id: file._id,
                  width: file.width,
                  height: file.height
                }
              );

            });
            if (!retrying) {
              this.subject.next(result);
              this.subject.complete();
            }
          }
        }
      );
    }
  }

  upload(files, fsCollection:Mongo.Collection, subscription:string, properties = undefined):Subject {
    this.ids = [];
    this.fsCollection = fsCollection;
    this.properties = properties | {};
    this.subscription = subscription;

    if (!_.isArray(files))
      files = [files];
    for (let i = 0; i < files.length; i++) {
      let newFile = new FS.File(files[i]);
      if (properties) {
        _.extend(newFile, properties);
      }
      let fileObj:any = fsCollection.insert(newFile, (error, fileResult)=> {
        if (error) {
          log.error(error);
          this.subject.error(error);
          return;
        } else {
          // async upload kicked off
        }
      });
      this.ids.push(fileObj._id);
    }
    this.intervalHandle = Meteor.setInterval(()=> {
      this.checkIfDone()
    }, 333);
    this.serverWaits = 0;
    return this.subject;
  }
*/
  /**
   * Converts DataURL to Blob object
   *
   * https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
   *
   * @param  {String} dataURL
   * @return {Blob}
   */
  static dataURLToBlob(dataURL) {
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
  static blobToArrayBuffer(ngZone:NgZone, blob, callback, errorCallback) {
    ngZone.runOutsideAngular(()=>{
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
      
    })
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
  static uploadDataUrl(ngZone:NgZone, dataUrl, name, colleciton, resolve, reject) {
    // convert to Blob
    let blob = Uploader.dataURLToBlob(dataUrl);
    blob.name = name;

    // pick from an object only: name, type and size
    const file = _.pick(blob, 'name', 'type', 'size');

    // convert to ArrayBuffer
    Uploader.blobToArrayBuffer(ngZone, blob, (data) => {
      const upload = new UploadFS.Uploader({
        data,
        file,
        store: colleciton,
        onError: reject,
        onComplete: resolve
      });

      upload.start();
    }, reject);
  }

  static uploadFile(ngZone:NgZone, currentFile, collection, successCallback, errorCallback) {

    ngZone.runOutsideAngular(()=>{
      let reader = new FileReader();
      let dataURL:any;
//    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
      reader.onload = (e:any) => {
        dataURL =dataURL = reader.result;
        Uploader.uploadDataUrl(
          ngZone,
          dataURL,
          currentFile.name,
          collection,
          (result) => {
            successCallback(result);
          }, (error) => {
            errorCallback(error);
          }
        );
      };
      reader.readAsDataURL(currentFile);
      
    })

  }
}
