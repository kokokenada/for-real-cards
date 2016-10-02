/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component } from '@angular/core';

import {DealModalBase} from "./deal-modal-base";

import template from "./deal-modal.twbs.html";
import {ModalActions} from "../../common-app/src/ui/redux/modal/modal-actions.class";

@Component(
  {
    selector: 'frc-deal-modal',
    template: template
  }
)
export class DealModal extends DealModalBase {
  constructor(private myModalActions:ModalActions) {
    super(myModalActions);
  }
}
