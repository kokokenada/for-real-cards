/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';
import { Injector, NgZone } from '@angular/core';
import { select } from 'ng2-redux';


import { DragulaService } from 'ng2-dragula/ng2-dragula';


import { Card, CardCountAllowed, CardLocation, Deck, DeckLocation, GameConfig, Hand } from '../api';
import { DragAndDrop, ForRealCardsActions, GameRenderingTools, INITIAL_STATE_GAME_PLAY, INITIAL_STATE_FOR_REAL_CARDS } from '../ui';

import { CardImageStyle} from "../api/interfaces/card-image-style.interface";
import { GamePlayActions, IForRealCardsState, IGamePlayRecord} from "../ui";
import {DealModalService} from "../deal-modal/deal-modal.service";


export abstract class RunGame {
  @select() gamePlayReducer$;
  @select() forRealCardsReducer$;
  gamePlayActions :GamePlayActions;
  dragulaService: DragulaService;
  ngZone:NgZone;
  forRealCardsActions:ForRealCardsActions;
  injector: Injector;
  dealModelService:DealModalService;

  abstract childInit();
  gameState:IGamePlayRecord;
  forRealCardsState:IForRealCardsState;
  protected static dragAndDropInitialized:boolean = false;

  constructor(injector: Injector) {
    this.injector = injector;
    this.gamePlayActions = injector.get(GamePlayActions);
    this.dragulaService = injector.get(DragulaService);
    this.ngZone = injector.get(NgZone);
    this.forRealCardsActions = injector.get(ForRealCardsActions);
    this.dealModelService = injector.get(DealModalService);
  }

  ngOnInit() {
    this.gamePlayReducer$.subscribe( (gameState:IGamePlayRecord)=>{
      this.ngZone.run(()=>{
        if (gameState)
          this.gameState = gameState;
        else
          this.gameState = INITIAL_STATE_GAME_PLAY;
      });
    } );
    this.forRealCardsReducer$.subscribe( (forRealCardsState:IForRealCardsState)=>{
      this.ngZone.run(()=>{
        forRealCardsState = forRealCardsState || INITIAL_STATE_FOR_REAL_CARDS;
        this.forRealCardsState = forRealCardsState;
        if (forRealCardsState.gameId===null && !forRealCardsState.loading) { // Check to make sure loading request not already issued
          // We must have deep linked here or refreshed, so let's load the game
          let pathname:string[] = window.location.pathname.split('/');
          if (pathname.length>=3) {
            let subUrl:string = pathname[1];
            let gameId:string = pathname[2];
            this.forRealCardsActions.loadGameRequest(gameId, '');
          }
        }
      });
      this.childInit();
    } );
    this.dragAndDropInit();
  }

  private dragAndDropInit() { // Share a scope for drag and drop

    if (!RunGame.dragAndDropInitialized) {
      RunGame.dragAndDropInitialized = true;

      let moves = (el, source, handle, sibling)=> {
        return true; // elements are always draggable by default
      };
      let accepts = (el, target, source, sibling)=> {
        let dragAndDrop = new DragAndDrop(el, target, source, sibling, this.gameState);
        return dragAndDrop.isDropAllowed();
      };
      let invalid = (el, hanlde)=> {
/*        console.log('invalid')
        console.log(el);
        if (el.nodeName.toLowerCase()==="img") {  // Only drag container, not image so styling remains intact
          return true;
        }
        */
        return false;
      };

      let options = {
        copy: true,
        copySortSource: true,
        moves: moves,
        accepts: accepts,
        invalid: invalid
      };
//      console.log('setOPtions')
//      console.log(options)
      this.dragulaService.setOptions('drag-and-drop',
        options
      );
      this.dragulaService.drag.subscribe((value)=>{
        let [arg1, e, el] = value;
      });
      this.dragulaService.drop.subscribe((value)=>{
        let [arg1, el, targetEl, sourceEl, siblingEl] =value;
        let dragAndDrop = new DragAndDrop(el, targetEl, sourceEl, siblingEl, this.gameState);
        if (!dragAndDrop.isDropAllowed()) {
          dragAndDrop.logError("Drop received an element that should not have been allowed");
          return;
        }
//        console.log('drop')
//        console.log(dragAndDrop)

        dragAndDrop.runActions(this.gamePlayActions);
        
      });
    }
  }
  
  getHands():Hand[] {
    if (this.gameState)
      return this.gameState.hands.toArray();
  }

  getDecks() {
    return Deck.getDecks();
  }

  getCardsInHand(userId:string = Meteor.userId()):Card[] {
    let hand:Hand = this.getHand(userId);
    if (hand)
      return hand.cardsInHand;
  }

  getHand(userId:string = Meteor.userId()):Hand {
    if (this.gameState) {
      let hand:Hand = GamePlayActions.getHandFromUserId(this.gameState.hands, userId);
      return hand;
    }
  }

  getCardsInHandFaceUp(userId:string = Meteor.userId()):Card[] {
    if (this.gameState) {
      let hand:Hand = GamePlayActions.getHandFromUserId(this.gameState.hands, userId);
      if (hand)
        return hand.cardsFaceUp;
    }
  }

  getCardsInDeck():Card[] {
    if (this.gameState)
      return this.gameState.tableFaceDown.toArray();
  }

  getCardsInPile():Card[] {
    if (this.gameState)
      return this.gameState.tablePile.toArray();
  }

  getCardsFaceUp(userId:string = Meteor.userId()):Card[] {
    if (this.gameState) {
      let hand:Hand = GamePlayActions.getHandFromUserId(this.gameState.hands, userId);
      if (hand)
        return hand.cardsFaceUp;
    }
  }

  topCardInPile():Card {
    if (this.gameState && this.gameState.tablePile) {
      let length = this.gameState.tablePile.size;
      if (length)
        return this.gameState.tablePile.get(length - 1);
    }
  }

  shouldShowTableDrop():boolean {
    return (
      this.gameState &&
      this.gameState.currentGameConfig &&
      this.gameState.currentGameConfig.isTarget(CardLocation.TABLE)
    )
  }

  private tricksInProgress():boolean {
    let gameConfig:GameConfig = this.gameState.currentGameConfig;
    if (gameConfig) {
      if (gameConfig.hasTricks) {
        let hands:Hand[] =  this.gameState.hands.toArray();
        for (let i=0; i<hands.length; i++) {
          let hand:Hand = hands[i];
          if (hand.cardsFaceUp.length>0 || hand.tricks.length>0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  shouldShowPile():boolean {
    return (
      this.gameState &&
      this.gameState.currentGameConfig &&
      (
        this.tricksInProgress()===false &&
        (
          this.gameState.currentGameConfig.isTarget(CardLocation.PILE) ||
          this.gameState.currentGameConfig.isSource(CardLocation.PILE)
        )
      )
    );
  }


  shouldShowDeck():boolean {
    if (this.gameState && this.gameState.currentGameConfig)
      return this.tricksInProgress()===false && this.gameState.currentGameConfig.deckLocationAfterDeal == DeckLocation.CENTER;
  }

  cardBackURL(portrait:boolean = true):string {
    return GameRenderingTools.getCardBackURL(this.gameState.gameId, portrait);
  }

  canShowHand():boolean {
    return (
      this.gameState &&
      this.gameState.currentGameConfig && 
      this.gameState.currentGameConfig.findCommand(CardLocation.HAND, CardLocation.TABLE).cardCountAllowed===CardCountAllowed.ALL
    );
  }

  showHand():void {
    this.gamePlayActions.showHand(this.gameState);
  }
  
  landscapeCardStyle():CardImageStyle {
    return {
      // transform-not:rotate(90deg) scale(0.5, 3.5) !important; <!--transform:rotate(90deg) translate(-2.6vh, 0) !important;-->
      height: '100%',
      width: '100%' // !important needed?
    }
  }

  portraitCardStyle():CardImageStyle {
    return {
      height: '100%',
      width: '100%'
    }
  }
}

