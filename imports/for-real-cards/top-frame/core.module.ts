import {
  NgModule,
}       from '@angular/core';
import { CommonModule }      from '@angular/common';

import { TopFrameHeader } from "./top-frame-header";

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ TopFrameHeader ],
  exports:      [ TopFrameHeader ]
})
export class CoreModule {
}
