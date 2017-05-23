import { Component, NgZone } from '@angular/core';
import { select } from '@angular-redux/store';
import {EditUserProfileBase} from "../../common-app/src/ui-ng2/edit-user-profile/edit-user-profile.base";
import {LOGIN_PACKAGE_NAME, UPLOADED_PACKAGE_NAME} from 'common-app';

@Component({
  selector: 'edit-user-profile',
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>Edit User Profile</ion-title>
  </ion-navbar>
</ion-header>

<!--<ion-content>-->
  <form role="form" *ngIf="userEditted">
    <ion-list>
      <ion-item>
        <ion-label>Username</ion-label>
        <ion-input [(ngModel)]="userEditted.username" type="text"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Email</ion-label>
        <ion-input [(ngModel)]="userEditted.emails[0].address" type="text"></ion-input>
      </ion-item>
      <ion-item>
        <button (click)="save()" block>Save</button>
      </ion-item>

      <ion-list-header>
        Avatar
      </ion-list-header>

      <ion-item>
        <strong>Tap Image to set Avatar</strong>
      </ion-item>
      <ion-item>
        <div (click)="getPicture()">
                    <img [src]="avatarUrl()"/>
        </div>

        <table *ngIf="uploader?.queue.length">
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
                <span class="fa fa-upload"></span> Upload
              </button>
              <button type="button" class="btn btn-danger btn-xs"
                      (click)="item.remove()">
                <span class="fa fa-trash"></span> Remove
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </ion-item>
    </ion-list>
  </form>
  
`
})

export class EditUserProfileIonic extends EditUserProfileBase {
  @select(LOGIN_PACKAGE_NAME) loginReducer;
  @select(UPLOADED_PACKAGE_NAME) uploaderReducer;

  constructor(private ngZone:NgZone) {
    super();
  }

  ngOnInit()
  {
    this.initialize(this.ngZone, this.loginReducer, this.uploaderReducer);
  }
}