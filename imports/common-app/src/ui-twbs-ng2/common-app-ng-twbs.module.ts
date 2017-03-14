import { NgModule }      from '@angular/core';
import { CommonModule }      from '@angular/common';
import { CommonAppNg, COMMON_APP_NG_EXPORTS } from "../ui-ng2";
import { Avatar } from "./avatar/avatar";
import { ModalDialog } from "./modal/modal.component";
import { PopoverMenu } from "./popover-menu/popover-menu";
import { Ng2BootstrapModule, DropdownModule, TabsModule } from 'ng2-bootstrap';
import {UpdateAccountModal} from "./accounts-admin/update-account-modal";
import {UpdateRolesModal} from "./accounts-admin/update-roles-modal";
import {InfoAccountModal} from "./accounts-admin/info-account-modal";
import {ImpersonateAccountModal} from "./accounts-admin/impersonate-account-modal";
import {DeleteAccountModal} from "./accounts-admin/delete-account-modal";
import {AccountsAdmin} from "./accounts-admin/accounts-admin";
import {AlertModal} from "./common-popups/alert.modal";
import {ConfirmModal} from "./common-popups/confirm.modal";

const DYNAMIC =[
  UpdateAccountModal,
  UpdateRolesModal,
  InfoAccountModal,
  ImpersonateAccountModal,
  DeleteAccountModal,
  AlertModal,
  ConfirmModal
];

const COMMON_APP_NG_TWBS_EXPORTS = [
  Avatar,
  ModalDialog,
  PopoverMenu,
  AccountsAdmin,
  ...DYNAMIC
];
const PASSTHROUGH_MODULES =[
  CommonModule, CommonAppNg, Ng2BootstrapModule, DropdownModule
];

@NgModule({
  imports: [...PASSTHROUGH_MODULES, DropdownModule.forRoot(), TabsModule.forRoot()],
  declarations: [...COMMON_APP_NG_TWBS_EXPORTS],
  exports: [...COMMON_APP_NG_TWBS_EXPORTS, ...COMMON_APP_NG_EXPORTS, ...PASSTHROUGH_MODULES],
  entryComponents: [...DYNAMIC]
})
export class CommonAppNgTWBS {}