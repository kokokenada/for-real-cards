import {ModalBase} from '../../common-app/src/ui-ng2/modal/modal-base';
import {IBetModalParams, IBetModalResult} from './bet-modal.types';
import {Component} from '@angular/core';
import template from './bet-modal.twbs.html';
import {GamePlayActions} from '../ui/redux/game-play/game-play-actions.class';
import {GamePlayFunctions} from '../ui/redux/game-play/game-play.functions';
import {AccountTools} from '../../common-app/src/ui/services/account-tools';

@Component({
  selector: 'bet-modal',
  template: template // templateUrl caused NgbModal to get confused and load the app in the modal
})
export class BetModal extends ModalBase<IBetModalParams, IBetModalResult> {
  bet = 0;
  gettingMore = false;
  amountToGet = 100;
  available:number;
  error = "";

  ngAfterContentInit() {
    this.available = GamePlayFunctions.moneyPlayerHas(this.params.gameState, AccountTools.userId());
  }

  add(amount:number) {
    const newBalance = this.available - amount;
    if (newBalance>0)
      this.bet = this.bet + amount;
    else
      this.error = "Not enough available"
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

  getMoreStart() {
    this.gettingMore = true;
    this.error = "";
  }

  getMore() {
    GamePlayActions.buy(this.params.gameState, this.amountToGet);
    this.gettingMore = false;
    this.available = this.available + this.amountToGet;
    this.error = "";
  }
}