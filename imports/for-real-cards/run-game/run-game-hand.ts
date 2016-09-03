/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, Injector, NgZone, Optional, ViewEncapsulation } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Dragula, DragulaService } from 'ng2-dragula/ng2-dragula';


import { CommonAppButton, CommonPopups, PlatformTools, Tools } from '../../common-app';

import { RunGame } from './run-game.ts';
import { DealModalService } from "../deal-modal/deal-modal.service"
import { PlayingCard } from "../playing-card/playing-card";
import { Action, Card, CardImageStyle, GameConfig, CardLocation, CardCountAllowed, Hand} from "../api/index";
import {ActionFormatted} from "../ui/action-formatted.class";
import { DeckView } from "./deck-view";
import { PileView } from "./pile-view";

import template from "./run-game-hand.html"

@Component(
  {
    selector: 'run-game-hand',
    directives: [DeckView, Dragula, PileView, PlayingCard, CommonAppButton],
    providers: [DealModalService],
    encapsulation: ViewEncapsulation.None, // Require for Dragula .gu-transit
    template: template
  }
)
export class RunGameHand extends RunGame {
  @Input() showTableProxy:string;
  undoAction:Action;

  constructor(private dealModelService:DealModalService, private dragulaServiceChild: DragulaService, private ngZoneChild:NgZone,
              private injector: Injector) {
    super(dragulaServiceChild, ngZoneChild);
    if (PlatformTools.isIonic())  {
      let navParams = PlatformTools.getNavParams(injector);
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
      return RunGame.gameState && RunGame.gameState.currentGameConfig && RunGame.gameState.currentGameConfig.hasTricks && RunGame.gameState.trickReady();
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

