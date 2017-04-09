import { Component, Input, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { RunGame } from './run-game';
import { DealModalService } from "../deal-modal/deal-modal.service"
import { Card, CardImageStyle, GameConfig, CardLocation, CardCountAllowed, Hand} from "../api";
import { ActionFormatted, GamePlayActions} from "../ui";

import template from "./run-game-hand.html"
import {PlatformTools} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";
import {Tools} from "../../common-app/src/ui/services/tools";
import {DealModalParam, DealModalResult} from "../deal-modal/deal-modal-params-and-result";
import {CommonPopups} from "../../common-app/src/ui-ng2/common-popups/common-popups";

@Component(
  {
    selector: 'run-game-hand',
    providers: [DealModalService],
    encapsulation: ViewEncapsulation.None, // Require for Dragula .gu-transit
    template: template
  }
)
export class RunGameHand extends RunGame implements OnInit {
  @Input() showTableProxy:string;
  constructor(
    protected dragulaService: DragulaService,
    protected ngZone:NgZone,
    protected dealModelService:DealModalService,
    protected commonPopups:CommonPopups,
  ) {
    super();
  }

  childInit() {
    if (PlatformTools.isIonic())  {
      let navParams = PlatformTools.getNavParams();
      if (navParams) {
        this.showTableProxy = navParams.data.showTableProxy;
      }
    }
  }

  private showTableProxyBool():boolean {
    return Tools.stringToBool(this.showTableProxy);
  }

  shouldShowTableProxy():boolean {
    return this.showTableProxyBool() && (this.shouldShowDeck() || this.shouldShowPile() || this.shouldShowTableDrop());
  }

  shouldShowTakeTrick():boolean {
      return this.gameState && this.gameState.currentGameConfig && this.gameState.currentGameConfig.hasTricks && GamePlayActions.trickReady(this.gameState);
  }
  
  private numberOfBoxes():number {
    let numberOfBoxes = 
      (this.shouldShowDeck() ? 1 : 0) +
      (this.shouldShowPile() ? 1 : 0) +
      (this.shouldShowTableDrop() ? 1 : 0);
    return numberOfBoxes;
  }
  
  dropAreaStyle():Object {
    let numberOfBoxes = this.numberOfBoxes();
    if (numberOfBoxes===0)
      return "height:0px";

    let width = Math.round(1/numberOfBoxes*100);
    return {
      height:"15vh",
      width: width.toString() + '%',
      "text-align": "center",
      float: "left",
      position: 'relative',
      padding: "15px"
    };
  }
  
  takeTrick():void {
    GamePlayActions.takeTrick(this.gameState);
  }
  
  shouldShowSort():boolean {
    return (
      this.gameState &&
      this.gameState.currentGameConfig &&
      this.gameState.currentGameConfig.findCommand(CardLocation.HAND, CardLocation.HAND).cardCountAllowed!==CardCountAllowed.NONE
    );
  }
  
  sort():void {
    let cardOrder:Card[] = [];
    let hand:Hand = this.getHand();
    hand.sortHand();

    for (let i = 0; i < hand.cardsInHand.length; i++) {
      let card = hand.cardsInHand[i];
      cardOrder.push(card);
    }
    GamePlayActions.sortHand(this.gameState, cardOrder);
  }

  deal() {
    this.dealModelService.open(this.gameState).then(
      (dealModalResult:DealModalResult)=>{
        if (dealModalResult && dealModalResult.gameConfig) {
          if (dealModalResult.nextStep) {

          } else {
            GamePlayActions.deal(this.gameState, dealModalResult.gameConfig);
          }
        }
      }, (error)=> {
        this.commonPopups.alert(error);
      }
    );
  }

  shouldShowUndo():boolean {
    return (GamePlayActions.actionToUndo(this.gameState) ? true : false);
  }
  
  undo():void {
    
    let action:ActionFormatted  = new ActionFormatted( GamePlayActions.actionToUndo(this.gameState) );

    let prompt:string = "Undo " + action.actionDescription() + " done by "
      + (action.creatorId === Meteor.userId() ? "yourself" : action.creator());
    this.commonPopups.confirm(prompt).then(
      (result)=> {
        if (result) {
          GamePlayActions.undo(this.gameState, action._id);
        }
      }, (error)=> {
        this.commonPopups.alert(error);
      }
    );
  }
  
  inHandCardStyle():CardImageStyle {
    return {
      width: "71px",
      height: "100px"
    }
  } 
}

