import { Subscription } from 'rxjs'
import { NgZone } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';

import { FileUploader} from 'ng2-file-upload';
import { AvatarTools, UserEvent, UserEventType } from '../../ui';
import { AvatarOriginalStore, User } from '/imports/common-app-api';
import { AccountTools } from "../../ui/services/account-tools";
import { Uploader } from '../../ui/uploader'
import { CommonPopups } from '../common-popups/common-popups'
import {PlatformTools} from "../platform-tools/platform-tools";

export abstract class EditUserProfileBase {
  avatarURL:string;
  uploader:FileUploader = new FileUploader({});
  hasBaseDropZoneOver:boolean = false;

  subscription:Subscription;
  userEditted:User;

  constructor(private ngZone:NgZone) {
  }

  ngOnInit() {
    this.subscription = UserEvent.startObserving((event:UserEvent)=> {
      if (event.eventType === UserEventType.AVATAR_UPDATE && event.userId === Meteor.userId()) {
        this.ngZone.run(()=>{
          this.avatarURL = AvatarTools.getAvatarURL(event.user, "medium");
        });
      }
    });
    AccountTools.readCurrentUser().then(
      (user:User)=> {
        this.ngZone.run(()=> {
          this.addEmptyEmailIfNeeded(user);
          this.userEditted = user;
        });
      }, (error)=> {
        CommonPopups.alert(error);
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private addEmptyEmailIfNeeded(user:User):void {
    if (!user.emails || user.emails.length===0) { // Make sure template has something to read/write
      user.emails = [];
      user.emails.push({address: ""});
    }
  }

  save() {
    if (this.userEditted.emails[0].address.length===0) {  // remove null address
      this.userEditted.emails.splice(0);
    }
    AccountTools.saveUser(this.userEditted).subscribe((user:User)=>{
      console.log("Saved");
      console.log(user);
    });
    this.addEmptyEmailIfNeeded(this.userEditted);
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  fileDrop(e:any):void {
    console.log(this.uploader.queue)
  }

  uploadToFSCollection():void {
    let files:any[] = [];
    this.uploader.queue.forEach((queueItem:any)=> {
      files.push(queueItem._file)
    });
    this.addImages(files);
  }

  addImages(files) {
    log.debug(files);
    let currentFile = files[0];
    Uploader.uploadFile(currentFile, AvatarOriginalStore).then(
      (result) => {
        console.log('upload success')
        console.log(result)
      }, (error) => {
        log.error("Error uploading");
        log.error(error);
        CommonPopups.alert(error);
      }
    );
  }

  avatarUrl():string {
    return this.avatarURL;
  }

  showCameraOption():boolean {
    return PlatformTools.isCordova();
  }

}