import { NgModule }      from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }      from '@angular/forms';
import { NgReduxModule } from '@angular-redux/store';

import { ConnectionStatus } from "./connect/connection-status.component";
import { CommonAppButton } from "./button/common-app-button";
import { MenuFilterPipe } from "./menu-filter/menu-filter";
import {ModalService} from "../ui/redux/modal/modal.service";
import {UsersAsync} from "../ui/redux/users/users-async.class";
import {UsersModule} from "../ui/redux/users/users.module";
import {UploaderAsync} from "../ui/redux/uploader/uploader-async.class";
import {UploaderModule} from "../ui/redux/uploader/uploader.module";
import {ModalModule} from "../ui/redux/modal/modal.module";
import {CommonPopups} from "./common-popups/common-popups";
import {AccountsAdminModule} from "../ui/redux/accounts-admin/accounts-admin.module";
import {AccountsAdminAsync} from "../ui/redux/accounts-admin/accounts-admin-async.class";
import {AccountsAdminService} from "../ui/redux/accounts-admin/accounts-admin.service";

const COMMON_APP_EXPORTED_DECLARATIONS = [
  // Common-app
  ConnectionStatus,
  CommonAppButton,
  MenuFilterPipe
];
export const COMMON_APP_NG_EXPORTS = [
  ...COMMON_APP_EXPORTED_DECLARATIONS,
  // Third Party
  CommonModule,
  FormsModule,
  NgReduxModule
];

export const COMMON_APP_SINGLETONS = [
  AccountsAdminModule,
  AccountsAdminAsync,
  AccountsAdminService,
  CommonPopups,
  ModalModule,
  ModalService,
  UploaderModule,
  UploaderAsync,
  UsersModule,
  UsersAsync,
];

@NgModule({
  imports: [CommonModule, FormsModule, NgReduxModule],
  declarations: [COMMON_APP_EXPORTED_DECLARATIONS],
  exports: COMMON_APP_NG_EXPORTS
})
export class CommonAppNg {
}