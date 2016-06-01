/**
 * Created by kenono on 2016-04-17.
 */

import { Component } from '@angular/core';
import { Subscription } from 'rxjs'
import { Meteor } from 'meteor/meteor';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload';
import * as log from 'loglevel';

import { AccountTools, AvatarCollection, AvatarTools, Credentials, Uploader, UploadFileInfo, UserEvent, UserEventType } from "../../common-app/api"
import { CommonPopups } from "../../common-app/ui-twbs-ng2"


@Component({
  selector: 'edit-user-profile',
  directives: [FILE_UPLOAD_DIRECTIVES],
  template: `
<style>
  .my-drop-zone { border: dotted 3px lightgray; }
  .nv-file-over { border: dotted 3px red; }
</style>
<form role="form">
  <div class="panel-heading">
    <h3 class="panel-title">User Profile and Account</h3>
  </div>
  <div class="panel-body">
    <div class="row">
      <div class="form-group col-xs-6">
        <label for="username">Username:</label>
        <input [(ngModel)]="credentials.username" type="text" class="form-control" id="username">
      </div>
      <div class="form-group col-xs-6">
        <label for="email">Email</label><span> (optional)</span>
        <input [(ngModel)]="credentials.email" type="text" class="form-control" id="email">
      </div>
      <div class="form-group col-xs-6">
        <label for="avatar">Click here to select avatar</label>
        <input type="file" ng2FileSelect [uploader]="uploader" (onchange)="fileDrop($event)"/>
        <strong>OR</strong>
        
         <div ng2FileDrop
               [ngClass]="{'nv-file-over': hasBaseDropZoneOver}"
               (fileOver)="fileOverBase($event)"
               [uploader]="uploader"
               (onFileDrop)="fileDrop($event)"
             
               class="well my-drop-zone">
              Drop image here
          </div>
         
          <table class="table">
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
      <img [src]="avatarUrl()"/>
      
      
      
      <div class="form-group col-md-6">                    
        <button (click)="save()" class="btn btn-primary pull-right">Save</button> 
      </div>
    </div>
  </div>
</form>

`,
})

export class EditUserProfile {
  avatarURL:string;
  uploader:FileUploader = new FileUploader({url: URL});
  hasBaseDropZoneOver:boolean = false;

  credentials:Credentials = new Credentials("","");
  subscription:Subscription;
  constructor() {
    this.subscription = UserEvent.startObserving((event:UserEvent)=> {
      if (event.eventType === UserEventType.AVATAR_UPDATE && event.userId === Meteor.userId()) {
        this.avatarURL = event.imageURL;
      }
    });
  }

  ngOnInit() {
    console.log('init EditUserProfile');
    console.log(this);
    AccountTools.readCurrentUser();
  }
  ngOnChanges(obj) {
    console.log('onchanges EditUserProfile:');
    console.log(obj);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  fileDrop(e:any):void {
    console.log(this.uploader.queue)
  }

  uploadToFSCollection():void {
    let files:any[] = [];
    this.uploader.queue.forEach((queueItem:any)=>{
      files.push(queueItem._file)
    });
    this.addImages(files);
  }

  addImages(files) {
    log.debug(files);
    let uploader = new Uploader();
    uploader.upload(files, AvatarCollection, 'common.avatar-images', {userId: Meteor.userId()}).subscribe(
      (result:UploadFileInfo[]) => {
        AvatarTools.updateProfileAvatar(result);
      },
      (error) => {
        CommonPopups.alert(error);
      }
    );
  }

  avatarUrl():string {
    return this.avatarURL;
  }

}