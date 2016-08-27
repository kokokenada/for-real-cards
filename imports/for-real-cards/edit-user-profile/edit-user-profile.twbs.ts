/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone } from '@angular/core';
import { FILE_UPLOAD_DIRECTIVES } from 'ng2-file-upload';
import { EditUserProfileBase } from '/imports/common-app';


@Component({
  selector: 'edit-user-profile',
  directives: [FILE_UPLOAD_DIRECTIVES],
  templateUrl: '/imports/for-real-cards/edit-user-profile/edit-user-profile.twbs.html'
})

export class EditUserProfileTWBS extends EditUserProfileBase {
  constructor(private ngZone:NgZone) {
    super(ngZone);
  }
}