/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone } from '@angular/core';
import { CameraTools, CommonPopups, EditUserProfileBase, AvatarOriginalStore } from '/imports/common-app';

@Component({
  selector: 'edit-user-profile',
  templateUrl: '/imports/for-real-cards/edit-user-profile/edit-user-profile.ionic.html'
})

export class EditUserProfileIonic extends EditUserProfileBase {

  constructor(private ngZone:NgZone) {
    super(ngZone);
  }

  getPicture() {
    CameraTools.uploadImageFromCamera(AvatarOriginalStore).then(
      (result)=>{
        console.log('upload success')
      }, (error)=>{
        CommonPopups.alert(error);
      }
    );
  }
}