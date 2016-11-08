import { Component, Input } from '@angular/core';

import {DealModalBase} from "./deal-modal-base";

@Component(
  {
    selector: 'frc-deal-modal',
    templateUrl: '/imports/for-real-cards/deal-modal/deal-modal.ionic.html'
  }
)
export class DealModal extends DealModalBase {
  @Input() componentParameters:any;
  constructor() {
    super();
  }
}
  