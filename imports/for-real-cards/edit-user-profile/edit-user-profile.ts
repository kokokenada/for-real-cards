/**
 * Created by kenono on 2016-04-17.
 */

import { Component } from '@angular/core';
import { Subscription } from 'rxjs'
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';

import {AccountTools, AvatarCollection, AvatarTools, Credentials, Uploader, UploadFileInfo, UserEvent, UserEventType} from "../../common-app/api"
import {CommonPopups} from "../../common-app/ui-twbs-ng2"


@Component({
  selector: 'edit-user-profile',
  template: `

      <form role="form">
        <div class="panel-heading">
          <h3 class="panel-title">User Profile and Account</h3>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="form-group col-md-6">
              <label for="username">Username:</label>
              <input [(ngModel)]="credentials.username" type="text" class="form-control" id="username">
            </div>
            <div class="form-group col-md-6">
              <label for="email">Email</label><span> (optional)</span>
              <input [(ngModel)]="credentials.email" type="text" class="form-control" id="email">
            </div>
            <div class="form-group col-md-6">
              <label for="avatar">Avatar</label><span> (optional)</span>
              <div 
                ngf-drop
                ngf-select
                ngf-change="vm.addImages($files)"
                ngf-drag-over-class="{accept:'dragover', reject:'dragover-err', delay:100}"
                class="drop-box"
                ngf-multiple="false"
                ngf-allow-dir="false"
                ngf-accept="'image/*'"
                ngf-drop-available="true"
               >
                <div>Click here to select image</div>
              <div>
              <strong>OR</strong>
              </div>
                  <div>You can also drop image to here</div>
              </div>
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