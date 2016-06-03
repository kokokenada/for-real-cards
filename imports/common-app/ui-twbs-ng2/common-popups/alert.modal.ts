import { Component, Input } from '@angular/core';

import {CommonPopupModal} from "./common-popup.class";

@Component(
  {
    selector: 'alert-modal',
    template:
      `
<form role="form" class="form-horizontal">
    <div class="panel-heading">
      <h3 class="panel-title">{{titleText}}</h3>
      {{messageText}}
      <div class="form-group col-md-6"> 
        <button (click)="ok()" class="btn btn-success pull-right">{{okText}}</button> 
      </div>
    </div>
</form>    
`
  })
export class AlertModal extends CommonPopupModal {
  @Input() componentParameters;

  constructor() {
    super();
  }
}