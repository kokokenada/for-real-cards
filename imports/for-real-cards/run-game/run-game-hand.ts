/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, Input, Injector, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { select } from 'ng2-redux';
import { Meteor } from 'meteor/meteor';
import { Dragula, DragulaService } from 'ng2-dragula/ng2-dragula';


import { CommonAppButton, CommonPopups, PlatformTools, Tools } from '../../common-app';

import { RunGame } from './run-game.ts';
import { DealModalService } from "../deal-modal/deal-modal.service"
import { PlayingCard } from "../playing-card/playing-card";
import { Card, CardImageStyle, GameConfig, CardLocation, CardCountAllowed, Hand} from "../api";
import { ActionFormatted, GamePlayActions} from "../ui";
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
export class RunGameHand extends RunGame implements OnInit {
  @Input() showTableProxy:string;
  @select() gamePlayReducer;

  constructor(
    private dealModelService:DealModalService,
    private gamePlayActions:GamePlayActions,
    private dragulaServiceChild: DragulaService,
    private ngZoneChild:NgZone,
    private injector: Injector) {
    super(gamePlayActions, dragulaServiceChild, ngZoneChild);
    if (PlatformTools.isIonic())  {
      let navParams = PlatformTools.getNavParams(injector);
      if (navParams) {
        this.showTableProxy = navParams.data.showTableProxy;
      }
    }
  }

  ngOnInit() {
    this.initialize(this.gamePlayReducer)
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
    this.gamePlayActionsBase.takeTrick(this.gameState);
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
    this.gamePlayActionsBase.sortHand(this.gameState, cardOrder);
  }

  deal() {
    let defaultGameConfig:GameConfig;
    if (this.gameState)
      defaultGameConfig = this.gameState.currentGameConfig;
    this.dealModelService.open(defaultGameConfig).then(
      (gameConfig:GameConfig)=>{
        if (gameConfig) {
          this.gamePlayActionsBase.deal(this.gameState, gameConfig);
        }
      }, (error)=> {
        CommonPopups.alert(error);
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
    CommonPopups.confirm(prompt).then(
      (result)=> {
        if (result) {
          this.gamePlayActions.undo(this.gameState, action._id);
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

