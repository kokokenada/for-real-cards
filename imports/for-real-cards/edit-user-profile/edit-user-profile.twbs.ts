/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone } from '@angular/core';
import { select } from 'ng2-redux';

//import { FormGroup, FormControl } from '@angular/forms';
import { FILE_UPLOAD_DIRECTIVES } from 'ng2-file-upload';
import { EditUserProfileBase } from '../../common-app/index';
import {LoginActions} from "../../common-app/src/ui/redux/login/login-actions.class";
import {UploaderActions} from "../../common-app/src/ui/redux/uploader/uploader-actions.class";

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
      <button *ngIf="showCameraOption()">Camera</button>
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
      
      <div *ngIf="uploaderState?.uploadInProgress">
        Uploading...
      </div>
      <div *ngIf="uploaderState?.lastUploadErrorMessage?.length>0" class="glyphicon glyphicon-exclamation-sign">
         {{uploaderState?.lastUploadErrorMessage}}
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

`
})

export class EditUserProfileTWBS extends EditUserProfileBase {
  @select() loginReducer;
  @select() uploaderReducer;

  constructor(private ngZone:NgZone, private loginActions:LoginActions, private uploaderActions:UploaderActions) {
    super();
  }
  ngOnInit()
  {
    this.initialize(this.ngZone, this.loginReducer, this.loginActions, this.uploaderActions, this.uploaderReducer);
  }

}

