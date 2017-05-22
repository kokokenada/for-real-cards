import { Observable } from 'rxjs'
import { NgZone } from '@angular/core';


import { IUser, LoginActions, ILoginState,  } from 'common-app';
import { AvatarOriginalStore } from '../../../../common-app-meteor/avatar.model';
import {PlatformTools} from "../platform-tools/platform-tools";
import { UploaderActions } from "../../ui";
import {IUploaderState} from "../../ui/redux/uploader/uploader-types";

export abstract class EditUserProfileBase {
  avatarURL:string;
  hasBaseDropZoneOver:boolean = false;
  userEditted:IUser;
  uploaderState:IUploaderState;
  private ngZoneBase:NgZone;

  initialize(ngBase:NgZone, loginStateObserver:Observable<ILoginState>, uploadStateObserver:Observable<IUploaderState>) {
    this.ngZoneBase = ngBase;
    loginStateObserver.subscribe( (loginState:ILoginState)=>{
      ngBase.run( ()=>{
        let user: IUser = loginState.user;
        if (user)
          this.addEmptyEmailIfNeeded(user);
        this.userEditted = user;
        if (user && user.profile)
          this.avatarURL = loginState.user.profile["avatar-original"];
      });
    });
    uploadStateObserver.subscribe( (uploadState:IUploaderState)=>{
      ngBase.run( ()=>{
        this.uploaderState = uploadState;
      });
    });
  }

  private addEmptyEmailIfNeeded(user: IUser):void {
    if (!user.emails || user.emails.length===0) { // Make sure template has something to read/write
      user.emails = [];
      user.emails.push({address: ""});
    }
  }

  save() {
    if (this.userEditted.emails[0].address.length===0) {  // remove null address
      this.userEditted.emails.splice(0);
    }
    LoginActions.saveUser(this.userEditted);
    this.addEmptyEmailIfNeeded(this.userEditted);
  }

  fileOver(e:any):void {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }

  fileDrop(event:any):void {
    var transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }
    this._preventAndStop(event);
    let file = event.dataTransfer.files[0];
    UploaderActions.uploadStartRequest(file, AvatarOriginalStore)
    this.hasBaseDropZoneOver = event;
  }

  private _getTransfer = function (event) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  };

   private _preventAndStop = function (event) {
    event.preventDefault();
    event.stopPropagation();
  };


  fileSelect(e:any):void {
    console.log(e)
    console.log(e.srcElement.files[0]);
    let file = e.srcElement.files[0];
    UploaderActions.uploadStartRequest(file, AvatarOriginalStore)
  }

  avatarUrl():string {
    return this.avatarURL;
  }

  showCameraOption():boolean {
    return PlatformTools.isCordova();
  }

  showDragOption():boolean {
    return !PlatformTools.isCordova();
  }

  getImageFromCamera():void {
    UploaderActions.uploadCameraPicRequest(AvatarOriginalStore);
  }

}