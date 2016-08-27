/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input } from '@angular/core';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { ModalService } from '/imports/common-app';

import {DealModalBase} from "./deal-modal-base";

@Component(
  {
    selector: 'frc-deal-modal',
    directives: [DROPDOWN_DIRECTIVES],
    providers: [ModalService],
    templateUrl: '/imports/for-real-cards/deal-modal/deal-modal.twbs.html'
  }
)
export class DealModal extends DealModalBase {
  @Input() componentParameters:any;
  constructor() {
    super();
  }
}
