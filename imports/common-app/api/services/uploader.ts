/**
 * Created by kenono on 2016-04-21.
 */
import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor';
import { Observable, Subject, Subscription } from 'rxjs'
import * as log from 'loglevel';

export interface UploadFileInfo { 
  _id: string;
  height?: number
  width?:number
}

export class Uploader {
  private fsCollection:Mongo.Collection;
  private properties;
  private subscription:string;
  private intervalHandle;
  private serverWaits = 0;
  private ids:string[];
  private subject:Subject;

  constructor() {
    this.subject = new Subject();
  }

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
                  this.intervalHandle = Meteor.setInterval(()=>{this.checkIfDone()}, 333);
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
      let fileObj = fsCollection.insert(newFile, (error, fileResult)=> {
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
    this.intervalHandle = Meteor.setInterval(()=>{this.checkIfDone()}, 333);
    this.serverWaits = 0;
    return this.subject;
  }
};

