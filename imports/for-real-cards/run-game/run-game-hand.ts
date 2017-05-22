import {Component, Input, NgZone, OnInit, ViewEncapsulation} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import {DragulaService} from 'ng2-dragula/ng2-dragula';

import {RunGame} from './run-game';
import {DealModalService} from "../deal-modal/deal-modal.service"
import {Card, GameConfig, GamePlayActions, CardLocation, CardCountAllowed, Hand} from "../../for-real-cards-lib";
import { CardImageStyle } from '../../for-real-cards-web';
import {ActionFormatted, } from "../ui";

import template from "./run-game-hand.html"
import {PlatformTools} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";
import {LoginPackage, Tools} from 'common-app';
import {DealModalParam, DealModalResult} from "../deal-modal/deal-modal-params-and-result";
import {CommonPopups} from "../../common-app/src/ui-ng2/common-popups/common-popups";
import {BetlModalService} from '../bet-modal/bet-modal.service';
import {IBetModalResult} from '../bet-modal/bet-modal.types';

@Component(
  {
    selector: 'run-game-hand',
    providers: [DealModalService],
    encapsulation: ViewEncapsulation.None, // Require for Dragula .gu-transit
    template: template
  }
)
export class RunGameHand extends RunGame implements OnInit {
  @Input() showTableProxy: string;

  constructor(protected dragulaService: DragulaService,
              protected ngZone: NgZone,
              protected dealModelService: DealModalService,
              protected betModalService: BetlModalService,
              protected commonPopups: CommonPopups,) {
    super();
  }

  childInit() {
    if (PlatformTools.isIonic()) {
      let navParams = PlatformTools.getNavParams();
      if (navParams) {
        this.showTableProxy = navParams.data.showTableProxy;
      }
    }
  }

  private showTableProxyBool(): boolean {
    return Tools.stringToBool(this.showTableProxy);
  }

  shouldShowTableProxy(): boolean {
    return this.showTableProxyBool() && (this.shouldShowDeck() || this.shouldShowPile() || this.shouldShowTableDrop());
  }

  shouldShowTakeTrick(): boolean {
    return this.gameState && this.gameState.currentGameConfig && this.gameState.currentGameConfig.hasTricks && GamePlayActions.trickReady(this.gameState);
  }

  private numberOfBoxes(): number {
    let numberOfBoxes =
      (this.shouldShowDeck() ? 1 : 0) +
      (this.shouldShowPile() ? 1 : 0) +
      (this.shouldShowTableDrop() ? 1 : 0);
    return numberOfBoxes;
  }

  dropAreaStyle(): Object {
    let numberOfBoxes = this.numberOfBoxes();
    if (numberOfBoxes === 0)
      return "height:0px";

    let width = Math.round(1 / numberOfBoxes * 100);
    return {
      height: "15vh",
      width: width.toString() + '%',
      "text-align": "center",
      float: "left",
      position: 'relative',
      padding: "15px"
    };
  }

  takeTrick(): void {
    GamePlayActions.takeTrick(this.gameState);
  }

  shouldShowSort(): boolean {
    return (
      this.gameState &&
      this.gameState.currentGameConfig &&
      this.gameState.currentGameConfig.findCommand(CardLocation.HAND, CardLocation.HAND).cardCountAllowed !== CardCountAllowed.NONE
    );
  }

  shouldShowBets(): boolean {
    return (
      this.gameState &&
      this.gameState.currentGameConfig &&
      this.gameState.currentGameConfig.hasBets
      );
  }

  bet() {
    this.betModalService.open(this.gameState).then( (result:IBetModalResult) => {
      if (result && result.didBet) {
        GamePlayActions.bet(this.gameState, result.value);
      }
    })
  }

  fold() {
    this.commonPopups.confirm("Confirm Fold").then( () => {
      GamePlayActions.fold(this.gameState);
    });
  }

  sort(): void {
    let cardOrder: Card[] = [];
    let hand: Hand = this.getHand( LoginPackage.lastLoginState.userId );
    hand.sortHand();

    for (let i = 0; i < hand.cardsInHand.length; i++) {
      let card = hand.cardsInHand[i];
      cardOrder.push(card);
    }
    GamePlayActions.sortHand(this.gameState, cardOrder);
  }

  deal() {
    this.dealModelService.open(this.gameState).then(
      (dealModalResult: DealModalResult) => {
        if (dealModalResult && dealModalResult.nextStep) {
          GamePlayActions.nextStep(this.gameState);
        } else {
          if (dealModalResult && dealModalResult.gameConfig) {
            GamePlayActions.deal(this.gameState, dealModalResult.gameConfig, dealModalResult.numberOfCards);
          }
        }
      }, (error) => {
        this.commonPopups.alert(error);
      }
    );
  }

  shouldShowUndo(): boolean {
    return (GamePlayActions.actionToUndo(this.gameState) ? true : false);
  }

  undo(): void {

    let action: ActionFormatted = new ActionFormatted(GamePlayActions.actionToUndo(this.gameState));

    let prompt: string = "Undo " + action.actionDescription() + " done by "
      + (action.creatorId === LoginPackage.lastLoginState.userId ? "yourself" : action.creator());
    this.commonPopups.confirm(prompt).then(
      (result) => {
        if (result) {
          GamePlayActions.undo(this.gameState, action._id);
        }
      }, (error) => {
        this.commonPopups.alert(error);
      }
    );
  }

  inHandCardStyle(): CardImageStyle {
    return {
      width: "71px",
      height: "100px"
    }
  }
}

