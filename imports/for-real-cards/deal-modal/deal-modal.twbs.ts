import { Component } from '@angular/core';

import {DealModalBase} from "./deal-modal-base";

import template from "./deal-modal.twbs.html";

@Component(
  {
    selector: 'frc-deal-modal',
    template: template
  }
)
export class DealModal extends DealModalBase {
}
