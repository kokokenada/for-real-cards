import { NgModule }      from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }      from '@angular/forms';
import { NgReduxModule } from 'ng2-redux';

import { ConnectionStatus } from "./connect/connection-status.component";
import { CommonAppButton } from "./button/common-app-button";
import { MenuFilterPipe } from "./menu-filter/menu-filter";
import {ModalService} from "../ui/redux/modal/modal.service";
import {ModalActions} from "../ui/redux/modal/modal-actions.class";
import {ReduxModuleCombiner} from "../ui/redux/redux-module-combiner";
import {UsersActions} from "../ui/redux/users/users-actions.class";
import {UsersAsync} from "../ui/redux/users/users-async.class";
import {UsersModule} from "../ui/redux/users/users.module";
import {UploaderAsync} from "../ui/redux/uploader/uploader-async.class";
import {UploaderActions} from "../ui/redux/uploader/uploader-actions.class";
import {UploaderModule} from "../ui/redux/uploader/uploader.module";
import {LoginModule} from "../ui/redux/login/login.module";
import {LoginAsync} from "../ui/redux/login/login-async.class";
import {LoginActions} from "../ui/redux/login/login-actions.class";
import {ConnectModule} from "../ui/redux/connect/connect.module";
import {ConnectAsync} from "../ui/redux/connect/connect-async.class";
import {ConnectActions} from "../ui/redux/connect/connect-actions.class";
import {CommonPopups} from "./common-popups/common-popups";

const COMMON_APP_EXPORTED_DECLARATIONS = [
  // Common-app
  ConnectionStatus,
  CommonAppButton,
  MenuFilterPipe,
];
export const COMMON_APP_NG_EXPORTS = [
  ...COMMON_APP_EXPORTED_DECLARATIONS,
  // Third Party
  CommonModule,
  FormsModule,
  NgReduxModule
];

export const COMMON_APP_SINGLETONS = [
  CommonPopups,
  ConnectActions,
  ConnectAsync,
  ConnectModule,
  LoginActions,
  LoginAsync,
  LoginModule,
  ModalActions,
  ModalService,
  ReduxModuleCombiner,
  UploaderModule,
  UploaderActions,
  UploaderAsync,
  UsersModule,
  UsersAsync,
  UsersActions
];

@NgModule({
  imports: [CommonModule, FormsModule, NgReduxModule],
  declarations: [COMMON_APP_EXPORTED_DECLARATIONS],
  exports: COMMON_APP_NG_EXPORTS
})
export class CommonAppNg {
}