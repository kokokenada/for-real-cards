import { Observable, Subscription } from 'rxjs'
import { NgZone } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';

import { FileUploader} from 'ng2-file-upload';
import { AvatarTools, UserEvent, UserEventType } from '../../ui';
import { AvatarOriginalStore, User } from '../../../../common-app-api';
import { Uploader } from '../../ui/uploader'
import { CommonPopups } from '../common-popups/common-popups'
import {PlatformTools} from "../platform-tools/platform-tools";
import {LoginActions, ILoginState} from "../../ui";

export abstract class EditUserProfileBase {
  avatarURL:string;
  uploader:FileUploader = new FileUploader({});
  hasBaseDropZoneOver:boolean = false;
  userEditted:User;
  private ngZoneBase:NgZone;
  private loginActionsBase:LoginActions

  initialize(ngBase:NgZone, stateObserver:Observable<ILoginState>, loginActions:LoginActions) {
    this.ngZoneBase = ngBase;
    this.loginActionsBase = loginActions;
    stateObserver.subscribe( (loginState:ILoginState)=>{
      this.userEditted = loginState.user;
    });
/*
    this.subscription = UserEvent.startObserving((event:UserEvent)=> {
      if (event.eventType === UserEventType.AVATAR_UPDATE && event.userId === Meteor.userId()) {
        this.ngZoneBase.run(()=>{
          this.avatarURL = AvatarTools.getAvatarURL(event.user, "medium");
        });
      }
    });*/
    loginActions.readCurrrentUser();
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
    this.loginActionsBase.saveUser(this.userEditted);
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