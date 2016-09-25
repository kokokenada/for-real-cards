import { NgModule }      from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }      from '@angular/forms';
import { ConnectionStatus } from "./connect/connection-status.component";
import { CommonAppButton } from "./button/common-app-button";

export const COMMON_APP_NG_EXPORTS = [ConnectionStatus, CommonAppButton, CommonModule, FormsModule];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [ConnectionStatus, CommonAppButton],
  exports: COMMON_APP_NG_EXPORTS
})
export class CommonAppNg {

}