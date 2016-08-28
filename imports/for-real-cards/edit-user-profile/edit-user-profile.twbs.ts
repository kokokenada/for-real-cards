/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone } from '@angular/core';
import { FILE_UPLOAD_DIRECTIVES } from 'ng2-file-upload';
import { EditUserProfileBase } from '../../common-app/index';

import template from "./edit-user-profile.twbs.html";

@Component({
  selector: 'edit-user-profile',
  directives: [FILE_UPLOAD_DIRECTIVES],
  template: tempalte
})

export class EditUserProfileTWBS extends EditUserProfileBase {
  constructor(ngZone:NgZone) {
    super(ngZone);
  }
}