/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone } from '@angular/core';
import { select } from 'ng2-redux';

//import { FormGroup, FormControl } from '@angular/forms';
import { EditUserProfileBase } from '../../common-app/index';
import {LoginActions} from "../../common-app/src/ui/redux/login/login-actions.class";
import {UploaderActions} from "../../common-app/src/ui/redux/uploader/uploader-actions.class";

@Component({
  selector: 'edit-user-profile',
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
      <h3 for="avatar">Avatar</h3>
      <div class="container">
        <div class="row">
           <div class="col-xs-6">
              <img [src]="avatarUrl()" style="max-width: 80%; height: auto"/> 
           </div>        
           <div class="col-xs-6">
              <input type="file" (change)="fileSelect($event)"/>
              <div *ngIf="showCameraOption()">
                <strong>OR</strong>
                 <button (click)="getImageFromCamera()">Camera</button>
              </div>
              <div *ngIf="showDragOption()">
                <strong>OR</strong>
                <div 
                     (drop)="fileDrop($event)"
                     (dragover)="fileOver($event)"
                     class="well"
                     style="height: 100px; border-style: dashed">
                  Drop image here
                </div>
              </div>
           </div>
        </div>
      </div>
      
      <div *ngIf="uploaderState?.uploadInProgress">
        Uploading... Progress: {{uploaderState?.progressPercent}}
      </div>
      <div *ngIf="uploaderState?.lastUploadErrorMessage?.length>0" class="glyphicon glyphicon-exclamation-sign">
         {{uploaderState?.lastUploadErrorMessage}}
      </div>
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

