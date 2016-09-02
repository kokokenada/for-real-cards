import { Observable, Subscription } from 'rxjs'
import { NgZone } from '@angular/core';
import * as log from 'loglevel';

import { FileUploader} from 'ng2-file-upload';
import { AvatarOriginalStore, User } from '../../../../common-app-api';
import {PlatformTools} from "../platform-tools/platform-tools";
import { LoginActions, ILoginState, UploaderActions } from "../../ui";
import {IUploaderState} from "../../ui/redux/uploader/uploader.types";

export abstract class EditUserProfileBase {
  avatarURL:string;
  uploader:FileUploader = new FileUploader({});
  hasBaseDropZoneOver:boolean = false;
  userEditted:User;
  uploaderState:IUploaderState;
  private ngZoneBase:NgZone;
  private loginActionsBase:LoginActions;
  private uploaderActionsBase:UploaderActions;

  initialize(ngBase:NgZone, loginStateObserver:Observable<ILoginState>, loginActions:LoginActions, uploaderActions:UploaderActions, uploadStateObserver:Observable<IUploaderState>) {
    this.ngZoneBase = ngBase;
    this.loginActionsBase = loginActions;
    this.uploaderActionsBase = uploaderActions;
    loginStateObserver.subscribe( (loginState:ILoginState)=>{
      console.log('loginState in EditUserProfileBase')
      console.log(loginState)
      this.userEditted = loginState.user;
    });
    uploadStateObserver.subscribe( (uploadState:IUploaderState)=>{
      this.uploaderState = uploadState;
    });
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

  private addImages(files) {
    log.debug(files);
    let currentFile = files[0];

    this.uploaderActionsBase.uploadFile(currentFile, AvatarOriginalStore);

  }

  avatarUrl():string {
    return this.avatarURL;
  }

  showCameraOption():boolean {
    return PlatformTools.isCordova();
  }

}