/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Subject, Subscription } from 'rxjs';
import * as log from 'loglevel';
import { Input, NgZone } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
//import { MeteorComponent } from 'angular2-meteor';

import { CommonPopups } from "../../common-app/ui-twbs-ng2";

import {Action, ActionType, Card, CardCountAllowed, CardLocation, Deck, DeckLocation, DragAndDrop, GameConfig, GameState, GameRenderingTools, Hand} from '../api';
import {CardImageStyle} from "../api/interfaces/card-image-style.interface";

const SESSION_GAME_ID_KEY = 'session-game-id';
export class RunGame {
  @Input() gameId:string;
  userPassword:string;
  static gameState:GameState;
  private static subject:Subject = new Subject();
  private static gameStreamInitializedToId:string;
  protected static dragAndDropInitialized:boolean = false;

  constructor(private dragulaService: DragulaService, private ngZone:NgZone) {
  }

  ngOnInit() {
    this.dragAndDropInit();
  }

  ngOnChanges(obj) {
    this.initialize();
  }

  static getActions():Action[] {
    return RunGame.gameState.actions;
  }
  
  static subscribe(onNext:(action:Action)=>void, onError:(error)=>void=undefined, onCompleted:()=>void=undefined):Subscription {
    return RunGame.subject.subscribe(onNext, onError, onCompleted);
  }

  dragAndDropInit() { // Share a scope for drag and drop

    if (!RunGame.dragAndDropInitialized) {
      RunGame.dragAndDropInitialized = true;

      let moves = (el, source, handle, sibling)=> {
        return true; // elements are always draggable by default
      };
      let accepts = (el, target, source, sibling)=> {
        let dragAndDrop = new DragAndDrop(el, target, source, sibling, RunGame.gameState.currentGameConfig);
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
      console.log('setOPtions')
      console.log(options)
      this.dragulaService.setOptions('drag-and-drop',
        options
      );
      this.dragulaService.drag.subscribe((value)=>{
        let [arg1, e, el] = value;
      });
      this.dragulaService.drop.subscribe((value)=>{
        let [arg1, el, targetEl, sourceEl, siblingEl] =value;
        let dragAndDrop = new DragAndDrop(el, targetEl, sourceEl, siblingEl, RunGame.gameState.currentGameConfig);
        if (!dragAndDrop.isDropAllowed()) {
          dragAndDrop.logError("Drop received an element that should not have been allowed");
          return;
        }
        console.log('drop')
        console.log(dragAndDrop)

        dragAndDrop.runActions(RunGame.gameState);        
        
      });
    }
  }

  private initialize() {
   // console.log("initialize()")
    //console.log(this);
    if   (this.gameId===undefined) {
      console.log("gameId udefined")
      console.log(this)
      return;
    }
    if (RunGame.gameStreamInitializedToId !== this.gameId) {
      this.userPassword = Session.get('password');
      if (!this.amIIncluded()) {
        Meteor.call('ForRealCardsJoinGame', this.gameId, this.userPassword, (error, result:Hand)=> {
          if (error) {
            log.error(error);
          } else {
            this.setIncluded(result.gameId);
          }
        })
      }

      console.log('subscribing to game' + this.gameId);

      RunGame.gameState = new GameState(this.gameId, RunGame.subject);
      RunGame.gameState.startSubScriptions();
      RunGame.gameStreamInitializedToId = this.gameId;
      RunGame.subscribe(
        (action:Action)=> {
          if (action.sequencePosition+1===action.sequenceLength) {
            this.ngZone.run(()=>{
              console.log('rendered')
            });
          }
          /*           log.debug('Got subscription callback in run-game.ts. Action:');
           log.debug(action);
           log.debug(RunGame.gameState.hands)
           log.debug(this)*/
        },
        (error)=> {
          log.error(error);
          CommonPopups.alert(error);
        }
      );
    }
  }

  getHands():Hand[] {
    return RunGame.gameState.hands;
  }

  private amIIncluded():boolean {
    let sessionGameId = Session.get(SESSION_GAME_ID_KEY);
    return (sessionGameId === this.gameId);
  }

  private setIncluded(gameId:string) {
    Session.set(SESSION_GAME_ID_KEY, gameId)
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
    if (RunGame.gameState) {
      let hand:Hand = RunGame.gameState.getHandFromUserId(userId);
      return hand;
    }
  }

  getCardsInHandFaceUp(userId:string = Meteor.userId()):Card[] {
    if (RunGame.gameState) {
      let hand:Hand = RunGame.gameState.getHandFromUserId(userId);
      if (hand)
        return hand.cardsFaceUp;
    }
  }

  getCardsInDeck():Card[] {
    if (RunGame.gameState)
      return RunGame.gameState.tableFaceDown;
  }

  getCardsInPile():Card[] {
    if (RunGame.gameState)
      return RunGame.gameState.tablePile;
  }

  getCardsFaceUp(userId:string = Meteor.userId()):Card[] {
    if (RunGame.gameState) {
      let hand:Hand = RunGame.gameState.getHandFromUserId(userId);
      if (hand)
        return hand.cardsFaceUp;
    }
  }

  topCardInPile():Card {
    if (RunGame.gameState && RunGame.gameState.tablePile) {
      let length = RunGame.gameState.tablePile.length;
      if (length)
        return RunGame.gameState.tablePile[length - 1];
    }
  }

  shouldShowTableDrop():boolean {
    return (
      RunGame.gameState &&
      RunGame.gameState.currentGameConfig &&
      RunGame.gameState.currentGameConfig.isTarget(CardLocation.TABLE)
    )
  }

  private tricksInProgress():boolean {
    let gameConfig:GameConfig = RunGame.gameState.currentGameConfig;
    if (gameConfig) {
      if (gameConfig.hasTricks) {
        let hands:Hand[] =  RunGame.gameState.hands;
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
      RunGame.gameState &&
      RunGame.gameState.currentGameConfig &&
      (
        this.tricksInProgress()===false &&
        (
          RunGame.gameState.currentGameConfig.isTarget(CardLocation.PILE) ||
          RunGame.gameState.currentGameConfig.isSource(CardLocation.PILE)
        )
      )
    );
  }


  shouldShowDeck():boolean {
    if (RunGame.gameState && RunGame.gameState.currentGameConfig)
      return this.tricksInProgress()===false && RunGame.gameState.currentGameConfig.deckLocationAfterDeal == DeckLocation.CENTER;
  }

  cardBackURL(portrait:boolean = true):string {
    return GameRenderingTools.getCardBackURL(this.gameId, portrait);
  }

  canShowHand():boolean {
    return (
      RunGame.gameState &&
      RunGame.gameState.currentGameConfig && 
      RunGame.gameState.currentGameConfig.findCommand(CardLocation.HAND, CardLocation.TABLE).cardCountAllowed===CardCountAllowed.ALL
    );
  }

  showHand():void {
    RunGame.gameState.showHand();
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

