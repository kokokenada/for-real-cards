import {
  NgModule,
}       from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ReduxModuleCombiner } from "../../common-app";

import { TopFrameHeader } from "./top-frame-header";

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ TopFrameHeader ],
  exports:      [ TopFrameHeader ],
  providers:    [ ReduxModuleCombiner ]
})
export class CoreModule {
}
