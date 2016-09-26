/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Meteor } from 'meteor/meteor';

import { PlatformTools, Tools } from '../../common-app';

import { RunGame } from './run-game.ts';
import { DealModalService } from "../deal-modal/deal-modal.service"
import { Card, CardImageStyle, GameConfig, CardLocation, CardCountAllowed, Hand} from "../api";
import { ActionFormatted, GamePlayActions} from "../ui";

import template from "./run-game-hand.html"

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
  constructor(private injectorInjection: Injector) {
    super(injectorInjection);
  }

  childInit() {
    if (PlatformTools.isIonic())  {
      let navParams = PlatformTools.getNavParams(this.injector);
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
    this.gamePlayActions.takeTrick(this.gameState);
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
    this.gamePlayActions.sortHand(this.gameState, cardOrder);
  }

  deal() {
    let defaultGameConfig:GameConfig;
    if (this.gameState)
      defaultGameConfig = this.gameState.currentGameConfig;
    this.dealModelService.open(defaultGameConfig).then(
      (gameConfig:GameConfig)=>{
        if (gameConfig) {
          this.gamePlayActions.deal(this.gameState, gameConfig);
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
          this.gamePlayActions.undo(this.gameState, action._id);
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

