/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone } from '@angular/core';
import { Subscription } from 'rxjs'
import { Meteor } from 'meteor/meteor';
import { FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload';
import { User } from "../../common-app/api/index";
import * as log from 'loglevel';

import {
  AccountTools,
  AvatarOriginalStore,
  AvatarTools,
  Uploader,
  UploadFileInfo,
  UserEvent,
  UserEventType
} from "../../common-app/api/index"
import {CommonPopups} from "../../common-app/ui-twbs-ng2/index"


@Component({
  selector: 'edit-user-profile',
  directives: [FILE_UPLOAD_DIRECTIVES],
  template: `
<style>
  .my-drop-zone { border: dotted 3px lightgray; }
  .nv-file-over { border: dotted 3px red; }
</style>
<form role="form" *ngIf="userEditted">
  <div class="panel-heading">
    <h3 class="panel-title">User Profile and Account</h3>
  </div>
  <div class="panel-body">
    <div class="form-group">
      <label for="username">Username:</label>
      <input [(ngModel)]="userEditted.username" type="text" class="form-control" id="username"/>
    </div>
    <div class="form-group">
      <label for="email">Email</label><span> (optional)</span>
      <input [(ngModel)]="userEditted.emails[0].address" type="text" class="form-control" id="email"/>
    </div>
    <div class="form-group">                    
      <button (click)="save()" class="btn btn-primary pull-right">Save</button> 
    </div>

    <div class="form-group">
      <label for="avatar">Avatar</label>
      <input type="file" ng2FileSelect [uploader]="uploader" (onchange)="fileDrop($event)"/>
      <strong>OR</strong>
            
      <div ng2FileDrop
           [ngClass]="{'nv-file-over': hasBaseDropZoneOver}"
           (fileOver)="fileOverBase($event)"
           [uploader]="uploader"
           (onFileDrop)="fileDrop($event)"
         
           class="well my-drop-zone">
          Drop image here
        <img [src]="avatarUrl()"/>
      </div>
     
      <table *ngIf="uploader?.queue.length" class="table">
        <thead>
          <tr>
            <th width="50%">Name</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of uploader.queue">
            <td><strong>{{item.file.name}}</strong></td>
            <td nowrap>{{item.file.size}}</td>
            <td nowrap>
              <button type="button" class="btn btn-success btn-xs"
                      (click)="uploadToFSCollection()" [disabled]="item.isReady || item.isUploading || item.isSuccess">
                  <span class="glyphicon glyphicon-upload"></span> Upload
              </button>
              <button type="button" class="btn btn-danger btn-xs"
                      (click)="item.remove()">
                  <span class="glyphicon glyphicon-trash"></span> Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>        
    </div>
  </div>
</form>

`,
})

export class EditUserProfile {
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
    Uploader.uploadFile(currentFile, AvatarOriginalStore,
      (result) => {
        console.log('upload sucess')
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

}