import { NgModule }      from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }      from '@angular/forms';
import { CommonAppNg, COMMON_APP_NG_EXPORTS } from "../ui-ng2";
import { Avatar } from "./avatar/avatar";
import {ModalOutlet} from "./modal/modal-outlet.component";
import {ModalDialog} from "./modal/modal.component";

export const COMMON_APP_NB_TWBS_EXPORTS = [Avatar, ModalDialog, ModalOutlet];

@NgModule({
  imports: [CommonModule, FormsModule, CommonAppNg],
  declarations: [...COMMON_APP_NB_TWBS_EXPORTS],
  exports: [...COMMON_APP_NB_TWBS_EXPORTS, ...COMMON_APP_NG_EXPORTS]
})
export class CommonAppNgTWBS {

}