import {ModalBase} from '../../common-app/src/ui-ng2/modal/modal-base';
import {IBetModalParams, IBetModalResult} from './bet-modal.types';
import {Component} from '@angular/core';
import template from './bet-modal.twbs.html';

@Component({
  selector: 'bet-modal',
  template: template // templateUrl caused NgbModal to get confused and load the app in the modal
})
export class BetModal extends ModalBase<IBetModalParams, IBetModalResult> {
  bet = 0;

  add(amount:number) {
    this.bet = this.bet + amount;
  }

  placeBet() {
    let result:IBetModalResult = {
      didBet: true,
      value: this.bet
    };
    this.close(result);
  }

  cancel() {
    this.close(null);
  }
}