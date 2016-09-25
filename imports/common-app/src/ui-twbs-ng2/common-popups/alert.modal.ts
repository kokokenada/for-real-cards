import { Component, Input } from '@angular/core';

import {CommonPopupModal} from "../../ui-ng2/common-popups/common-popup.class";
import {ModalActions} from "../../ui/redux/modal/modal-actions.class";

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

  constructor(private modalActions:ModalActions) {
    super(modalActions);
  }
}