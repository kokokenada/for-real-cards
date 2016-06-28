/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, NgZone, ViewEncapsulation } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Dragula, DragulaService } from 'ng2-dragula/ng2-dragula';

import { CommonPopups } from "../../common-app/ui-twbs-ng2/index";
import { Tools } from "../../common-app/api/index";
import {CommonAppButton} from "../../common-app/ui-ng2/button/common-app-button";

import { RunGame } from './run-game.ts';
import { DealModalService } from "../deal-modal/deal-modal.service"
import { PlayingCard } from "../playing-card/playing-card";
import { Action, ActionFormatted, Card, CardImageStyle, GameConfig, CardLocation, CardCountAllowed, Hand} from "../api/index";
import { DeckView } from "./deck-view";
import { PileView } from "./pile-view";

@Component(
  {
    selector: 'run-game-hand',
    directives: [DeckView, Dragula, PileView, PlayingCard, CommonAppButton],
    providers: [DealModalService],
    encapsulation: ViewEncapsulation.None, // Require for Dragula .gu-transit
    templateUrl: '/imports/for-real-cards/run-game/run-game-hand.html',
  }
)
export class RunGameHand extends RunGame {
  @Input() showTableProxy:string;
  undoAction:Action;

  constructor(private dealModelService:DealModalService, private dragulaServiceChild: DragulaService, private ngZoneChild:NgZone ) {
    super(dragulaServiceChild, ngZoneChild);
  }

  private showTableProxyBool():boolean {
    return Tools.stringToBool(this.showTableProxy);
  }

  shouldShowTableProxy():boolean {
    return this.showTableProxyBool() && (this.shouldShowDeck() || this.shouldShowPile() || this.shouldShowTableDrop());
  }

  shouldShowTakeTrick():boolean {
      return RunGame.gameState && RunGame.gameState.currentGameConfig && RunGame.gameState.currentGameConfig.hasTricks && RunGame.gameState.trickReady();
  }
  
  numberOfColumns():string {
    let numberOfBoxes = 
      (this.shouldShowDeck() ? 1 : 0) +
      (this.shouldShowPile() ? 1 : 0) +
      (this.shouldShowTableDrop() ? 1 : 0);
    return (numberOfBoxes===0 ? "4" : (12/numberOfBoxes).toString());
  }
  
  takeTrick():void {
    RunGame.gameState.takeTrick();
  }
  
  shouldShowSort():boolean {
    return (
      RunGame.gameState &&
      RunGame.gameState.currentGameConfig &&
      RunGame.gameState.currentGameConfig.findCommand(CardLocation.HAND, CardLocation.HAND).cardCountAllowed!==CardCountAllowed.NONE
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
    RunGame.gameState.sortHand(cardOrder);
  }

  deal() {
    let defaultGameConfig:GameConfig;
    if (RunGame.gameState)
      defaultGameConfig = RunGame.gameState.currentGameConfig;
    this.dealModelService.open(defaultGameConfig).then(
      (gameConfig:GameConfig)=>{
        if (gameConfig) {
          RunGame.gameState.deal(gameConfig);
        }
      }, (error)=> {
        CommonPopups.alert(error);
      }
    );
  }

  shouldShowUndo():boolean {
    return RunGame.gameState && (RunGame.gameState.actionToUndo() ? true : false);
  }
  
  undo():void {
    
    let action:ActionFormatted  = new ActionFormatted( RunGame.gameState.actionToUndo() );

    let prompt:string = "Undo " + action.actionDescription() + " done by "
      + (action.creatorId === Meteor.userId() ? "yourself" : action.creator());
    CommonPopups.confirm(prompt).then(
      (result)=> {
        if (result) {
          RunGame.gameState.undo(action._id);
        }
      }, (error)=> {
        CommonPopups.alert(error);
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

