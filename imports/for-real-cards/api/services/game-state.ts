/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Meteor} from 'meteor/meteor';
import { Mongo} from 'meteor/mongo'
import { Tracker } from 'meteor/tracker';
import { ReplaySubject} from 'rxjs'
import * as log from 'loglevel';

import { GAME_SUBSCRPTION_NAME, GameSubscriptionOptions} from "../models/game.publications.ts";
import { Action, ActionCollection, ActionType, VisibilityType, ActionFormatted} from '../models/action.model'
import { GameConfig, DeckLocation} from '../models/game-config';
import { Hand, HandCollection} from '../models/hand.model';
import { Card} from '../models/card.model';
import { Deck, DeckId} from '../models/deck.model';
import {CardSuit, CardRank} from "../models/card.model";

export class GameState {
  private gameId:string;
  private subject:ReplaySubject;
  private lastNotified:Date;
  private handsOnServer:Hand[];
  hands:Hand[];
  tableFaceDown:Card[];
  tablePile:Card[];
  actions:Action[];
  currentGameConfig: GameConfig;
  private undoneIds:string[] = [];

  constructor(gameId:string, subject:ReplaySubject<Action>) {
    this.gameId = gameId;
    this.subject = subject;
    this.hands = [];
    this.tableFaceDown = [];
    this.tablePile = [];
    this.lastNotified = null;
    this.currentGameConfig = GameConfig.getDefaultConfig();
  }

  private processAction(actions:Action[], index:number):void {
    let action:Action = actions[index];
    //this.debugOutput('processing action (' + index.toString() + ')', action);
    if (this.isUndone(action)) {
      //log.debug('not doing action because it is undone');
      return;
    }
    switch (action.actionType)  {
      case ActionType.RESET:
        this.hands.forEach((hand:Hand)=> {
          hand.cardsFaceDown = [];
          hand.cardsFaceUp = [];
          hand.cardsInHand = [];
          hand.tricks = [];
        });
        this.tableFaceDown =[];
        this.tablePile = [];
        break;
      case ActionType.DEAL:

        let gameConfig:GameConfig = action.gameConfig;
        if (gameConfig) {
          this.currentGameConfig = gameConfig;
        } else {
          log.error('Expected gameConfig in DEAL action type')
          log.error(action);
          console.trace();
          throw new Meteor.Error('internal-error', 'deal action missing config');
        }
        // Add cards to table & shuffle
        action.cards.forEach((card:Card)=>{
          this.tableFaceDown.push(card);
        });
        break;
      case ActionType.NEW_HAND:
        this.startSubScriptions(); // loads user objects
        break;
      case ActionType.DECK_TO_HAND:
        if (action.cards) {
          action.cards.forEach((card:Card)=> {
            let index:number = Deck.indexOf(this.tableFaceDown, card)
            if (index === -1) {
              this.subject.error(new Meteor.Error('internal-error', 'Could not find card in deck'));
              log.error(card)
              log.error(this.tableFaceDown);
              log.error(action);
            } else {
              let hand:Hand = this.getHandFromUserId(action.toPlayerId);
              if (!hand) {
                this.subject.error(new Meteor.Error('internal-error', 'toPlayerId is missing from action'))
                log.error(action);
              } else {
                let cardToDeal:Card = this.tableFaceDown[index];
                switch (action.visibilityType) {
                  case VisibilityType.PLAYER:
                    hand.cardsInHand.push(cardToDeal);
                    break;
                  case VisibilityType.ALL:
                    hand.cardsFaceUp.push(cardToDeal);
                    break;
                  case VisibilityType.NO_ONE:
                    hand.cardsFaceDown.push(cardToDeal);
                    break;
                  default:
                    this.subject.error(new Meteor.Error('internal-error', 'Unexpected VisbilityType'));
                    log.error('unexpected VisbilityType')
                    log.error(action);
                }
                this.tableFaceDown.splice(index, 1);
              }
            }
          });
        } else {
          log.error('DECK_TO_HAND has no cards. Logging error and continuing');
          log.error(action);
          console.trace();
        }
        break;
      case ActionType.HAND_TO_TABLE:
      {
        let hand:Hand = this.getHandFromUserId(action.fromPlayerId);
        if (action.cards && action.cards.length > 0) {
          action.cards.forEach((card:Card)=> {
            let index:number = Deck.indexOf(hand.cardsInHand, card)
            if (index !== -1) {
              if (action.visibilityType === VisibilityType.ALL) {
                hand.cardsFaceUp.push(card);
                hand.cardsInHand.splice(index, 1);
              } else {
                log.error('Unexpected / unimplemented action.visibilityType');
                log.error(action);
                console.trace();

              }
            } else {
              log.error('Card to move from hand to deck is not found. Logging error and continuing');
              log.error(action);
              console.trace();
            }
          })
        } else {
          log.error('Hand to Deck no cards. Logging error and continuing');
          log.error(action);
          console.trace();
        }
        break;
      }
      case ActionType.HAND_TO_PILE:
      {
        let hand:Hand = this.getHandFromUserId(action.fromPlayerId);
        if (action.cards && action.cards.length > 0) {
          action.cards.forEach((card:Card)=> {
            let index:number = Deck.indexOf(hand.cardsInHand, card)
            if (index !== -1) {
              this.tablePile.push(card);
              hand.cardsInHand.splice(index, 1);
            } else {
              log.error('Card to move from hand to pile is not found. Logging error and continuing');
              log.error(action);
              console.trace();
            }
          })
        } else {
          log.error('Hand to Pile no cards. Logging error and continuing');
          log.error(action);
          console.trace();
        }
        break;
      }
      case ActionType.DECK_TO_PILE:
      {
        let index = 0;
        this.tablePile.push(this.tableFaceDown[index]);
        this.tableFaceDown.splice(index, 1);
        break;
      }
      case ActionType.HAND_SORT:
      {
        let hand:Hand = Hand.handForUser(this.hands, action.toPlayerId);
        let error:boolean = false;
        // Error checking to make sure sort if valud
        if (hand.cardsInHand.length!== action.cards.length) {
          log.error('Invalid sort, sort request count !== card count');
          //log.error(action);
          //console.trace();
          error=true;
        } else {
          for (let i = 0; i < hand.cardsInHand.length; i++) {
            let foundCount = 0;
            let handCard:Card = hand.cardsInHand[i];
            for (let j=0; j <action.cards.length; j++) {
              let sortCard:Card = action.cards[j];
              if (handCard.rank===sortCard.rank && handCard.suit===sortCard.suit) {
                foundCount++;
              }
            }
            if (foundCount !== 1) {
              log.error("Invalid sort, card mismatch");
              //log.error(action);
              //console.trace();
              error=true;
            }
          }
        }
        if (!error) {
          hand.cardsInHand = action.cards;
        } else {
          //log.error('sort not saved')
        }
        break;
      }
      case ActionType.PILE_TO_HAND: {
        let hand:Hand = this.getHandFromUserId(action.toPlayerId);
        if (action.cards && action.cards.length > 0) {
          action.cards.forEach((card:Card)=> {
            let index:number = Deck.indexOf(this.tablePile, card);
            if (index !== -1) {
              hand.cardsInHand.push(card);
              this.tablePile.splice(index, 1);
            } else {
              log.error('Card to move from pile to hand is not found. Logging error and continuing');
              log.error(action);
              console.trace();
            }
          })
        } else {
          log.error('Pile to Hand has no cards. Logging error and continuing');
          log.error(action);
          console.trace();
        }
        break;
      }
      case ActionType.PILE_TO_DECK: {
        if (action.cards && action.cards.length > 0) {
          action.cards.forEach((card:Card)=> {
            let index:number = Deck.indexOf(this.tablePile, card);
            if (index !== -1) {
              this.tableFaceDown.push(card);
              this.tablePile.splice(index, 1);
            } else {
              log.error('Card to move from pile to deck is not found. Logging error and continuing');
              log.error(action);
              console.trace();
            }
          });
        } else {
          log.error('Pile to Deck has no cards. Logging error and continuing');
          log.error(action);
          console.trace();
        }
        break;
      }
      case ActionType.HAND_TO_DECK: {
        let hand:Hand = this.getHandFromUserId(action.fromPlayerId);
        if (action.cards && action.cards.length > 0) {
          action.cards.forEach((card:Card)=> {
            let index:number = Deck.indexOf(hand.cardsInHand, card)
            if (index !== -1) {
              this.tableFaceDown.push(card);
              hand.cardsInHand.splice(index, 1);
            } else {
              log.error('Card to move from hand to deck is not found. Logging error and continuing');
              log.error(action);
              console.trace();
            }
          });
        } else {
          log.error('Hand to Deck has no cards. Logging error and continuing');
          log.error(action);
          console.trace();
        }
        break;
      }
      case ActionType.TABLE_TO_HAND: {
        let hand:Hand = this.getHandFromUserId(action.toPlayerId);
        if (action.cards && action.cards.length > 0) {
          action.cards.forEach((card:Card)=> {
            let index:number = Deck.indexOf(hand.cardsFaceUp, card);
            if (index !== -1) {
              hand.cardsFaceUp.splice(index, 1);
              hand.cardsInHand.push(card);
            } else {
              log.error('Card to move from table to hand is not found. Logging error and continuing');
              log.error(action);
              console.trace();
            }
          })
        } else {
          log.error('Table to Hand has no cards. Logging error and continuing');
          log.error(action);
          console.trace();
        }
        break;
      }
      case ActionType.TAKE_TRICK:
      {
        let hand:Hand = Hand.handForUser(this.hands, action.toPlayerId);
        let error:boolean = false;

        // Error checking to make sure sort if valud
        if (this.hands.length!== action.cards.length) {
          log.error('Invalid trick, not equal to numberof players');
          //log.error(action);
          //console.trace();
          error = true;
        } else {
          this.hands.forEach((eachHand:Hand)=> {
            if (eachHand.cardsFaceUp.length !== 1) {
              log.error('Error. Each player should have one card on the table');
              //log.error(action);
              //console.trace();
              error = true;
            }
          });
        }
        if (!error) {
          hand.tricks.push(action.cards);
          this.hands.forEach((eachHand:Hand)=> {
            eachHand.cardsFaceUp.splice(0, 1);
          });
        }
        break;
      }
      case ActionType.UNDO: {
        let foundUndoAction:Action = null;
        let playBackActions:Action[] = [];
        let actionIdBeingUndone = action.relatedActionId;
        // Walk through actions from the UNDO backwards
        for (let i=index; i>=0; i--) {
          let actionBeingExamined:Action = actions[i];
          //this.debugOutput('examining undo (' + i.toString() + ')', actionBeingExamined);
          if (
            actionBeingExamined._id === actionIdBeingUndone ||           // The 'parent' action
            actionBeingExamined.relatedActionId===actionIdBeingUndone)   // A 'child' action
          {
            // This is an action being undone
            this.addUndone(actionBeingExamined);
          } else if (actionBeingExamined._id===action._id ) {
            if (i===index && !foundUndoAction && actionBeingExamined.relatedActionId===actionIdBeingUndone) { // a sanity check
              // This the undo action we're working on
              foundUndoAction = actionBeingExamined;
            } else {
              log.error('unexpected state')
              log.error(actionBeingExamined)
              log.error(action)
            }
          } else if (actionBeingExamined.actionType===ActionType.RESET) {
            // This is the re-create start point

            // Reset
            playBackActions.push(actionBeingExamined);


            playBackActions.reverse();
            // And re-run actions since
            for (let j=0; j<playBackActions.length; j++) {
              let playBackAction = playBackActions[j];
              if (playBackAction.actionType!==ActionType.UNDO) {
                // Don't try to re-proces UNDO's
                this.processAction(playBackActions, j);
              }
            }
            break; // We're done
          } else if (foundUndoAction) {
            // This is an action to recreate from last RESET
            playBackActions.push(actionBeingExamined);
          } else {
            // this is an action that has happened since the action being undone. Hmmm
            playBackActions.push(actionBeingExamined);
          }
        }
        break;
      }

      default:
        log.error("Unexpected action type");
        log.error(action);
        console.trace();
    }
  }

  debugOutput(context:string, action:Action) {
    let af:ActionFormatted = new ActionFormatted(action);
    let cards:string = "";
    if (action.cards) {
      action.cards.forEach((card:Card)=>{
        cards += card.encode() + ' ';
      });
    }
    log.debug(context +
      ': id:' + action._id +
      ' creator:' + af.creator() +
      ' action:' + af.actionDescription() +
      (cards.length ? ' card:' + cards : "") +
      (af.toPlayer() ? ' toPlayer:' + af.toPlayer() : "") +
      (af.fromPlayer() ? ' fromPlayer:' + af.fromPlayer() : "") +
      (action.relatedActionId ? ' relatedId:' + action.relatedActionId : "")
    );
  }

  private isUndone(action:Action):boolean {
    return this.undoneIds.indexOf(action._id)!==-1;
  }

  private addUndone(action:Action) {
//    this.debugOutput('added undone', action);
    this.undoneIds.push(action._id);
  }

  actionToUndo():Action {
    // Walk through actions from latest
    if (this.actions) {
      for (let i = this.actions.length - 1; i >= 0; i--) {
        let actionBeingExamined:Action = this.actions[i];
        if (this.isUndoable(actionBeingExamined)) {
//          this.debugOutput('identified undo action', actionBeingExamined);
          return actionBeingExamined;
        }
      }
    }
  }

  private isUndoable(action:Action):boolean {
    switch (action.actionType) {
      case ActionType.HAND_SORT:
      case ActionType.NEW_HAND:
      case ActionType.UNDO:
      case ActionType.NEW_GAME:
        return false;
      default:
      {
        if (action.relatedActionId) // If has a related actionId then can't undo because it is like a child action
          return false;
        return !this.isUndone(action); // Don't undo twice
      }
    }
  }

  formatDebugTime(d:Date):string {
    if (!d)
      return "";
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds().toString() + ":" + d.getMilliseconds().toString();
  }

  private reconcileHands():void { // Need this because of on persisted hand elements
    if (!this.hands) {
      this.hands = [];
    }

    // Add any hands on the server, not on the display
    this.handsOnServer.forEach((handOnServer:Hand)=> {
      // Find server hand on display
      let handDisplayed = _.find(this.hands, (searchHand:Hand)=>{
        return searchHand._id===handOnServer._id
      });
      if (!handDisplayed) { // There isn't so add it
        this.hands.push(new Hand(handOnServer));
      }
    });

    // Maybe one support people leaving game (doesn't have that behavior now)
  }

  startSubScriptions() {
    Tracker.autorun(()=> {
      let options:GameSubscriptionOptions = {gameId: this.gameId};
      let subscriptionHandle =Meteor.subscribe(GAME_SUBSCRPTION_NAME, options, {
        onStop: (error) => {
          if (error) {
            log.error("Error returned from Meteor.subscribe");
            log.error(error);
            this.subject.error(error);
          }
        },
        onReady: ()=> {

        }
      });

      let isReady = subscriptionHandle.ready();
      if (isReady) {

        this.handsOnServer = <Hand[]>HandCollection.find({gameId: this.gameId}).fetch();
        this.reconcileHands();


        log.debug('execute action query. gameId:' + this.gameId)
        let actionCursor:Mongo.Cursor = ActionCollection.find({gameId: this.gameId}, {sort: {dateCreated: 1}});
        this.actions = actionCursor.fetch();
        log.debug(this.actions)
        log.debug('lastNotified: ' + this.formatDebugTime(this.lastNotified));
        let latest:Date = this.lastNotified;
        for (let i=0;i<this.actions.length;i++) {
          let action:Action = this.actions[i];
          action.sequencePosition = i;
          action.sequenceLength = this.actions.length;
          if (action.dateCreated>this.lastNotified) {
//            log.debug('date created:'  + this.formatDebugTime(action.dateCreated) + ", lastNotified:" + this.formatDebugTime(this.lastNotified) + ", oldest:" + this.formatDebugTime(latest))
            try {
              this.processAction(this.actions, i);
              this.subject.next(action);
              if (action.dateCreated>latest) {
                latest= action.dateCreated;
              }

            } catch (e) {
              log.error('caught exception processing action');
              log.error(e);
            }
          }
        }
        this.lastNotified = latest;
        
      }
    })
  }

  getHandFromUserId(userId:string):Hand {
    for (let i=0; i<this.hands.length; i++) {
      if (this.hands[i].userId===userId) {
        return this.hands[i];
      }
    }
    return null;
  }

  pushAction(action:Action):void {
    Meteor.call('fastcards.NewAction', action, (error)=> {
      if (error) {
        this.subject.error(error);
        log.error(error);
      }
    });
  }
  pushActions(actions:Action[]):void {
    Meteor.call('fastcards.NewActions', actions, (error)=> {
      if (error) {
        this.subject.error(error);
        log.error(error);
      }
    });
  }

  deal(gameConfig:GameConfig) {

    this.pushAction(new Action({  // Push RESET separately because it is a different undo block
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      actionType: ActionType.RESET
    }));

    let actions:Action[] = [];
    let initializeAction:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      actionType: ActionType.DEAL,
      gameConfig: gameConfig
    });

    // Add cards to table
    let deck:Deck = gameConfig.deck;
    if (!deck) {
      log.error('Expected deck to be defined in gameConfig in DEAL action type')
      console.trace();
      throw new Meteor.Error('internal-error', 'Expected deck to be defined in gameConfig in DEAL action type');
    }

    // Add cards to initialization action & shuffle
    deck.cards.forEach((card:Card)=>{
      initializeAction.cards.push(card);
    });
    Deck.shuffle(new Date().toUTCString() + this.gameId, initializeAction.cards);
    actions.push(initializeAction);

    // Give cards to players
    let deckPosition = 0;
    this.hands.forEach((hand:Hand)=>{
      if (gameConfig.numberOfCardsToPlayer>0) {
        let toPlayerAction:Action = new Action({
          gameId: this.gameId,
          creatorId: Meteor.userId(),
          actionType: ActionType.DECK_TO_HAND,
          visibilityType: VisibilityType.PLAYER,
          toPlayerId: hand.userId
        });
        for (let i=0; i<gameConfig.numberOfCardsToPlayer; i++) {
          toPlayerAction.cards.push(initializeAction.cards[deckPosition++]);
        }
        actions.push(toPlayerAction);
      }

      if (gameConfig.numberOfCardsToPlayerFaceUp>0) {
        let toPlayerAction:Action = new Action({
          gameId: this.gameId,
          creatorId: Meteor.userId(),
          actionType: ActionType.DECK_TO_HAND,
          visibilityType: VisibilityType.ALL,
          toPlayerId: hand.userId
        });
        for (let i=0; i<gameConfig.numberOfCardsToPlayerFaceUp; i++) {
          toPlayerAction.cards.push(initializeAction.cards[deckPosition++]);
        }
        actions.push(toPlayerAction);
      }
    });
    if (gameConfig.turnCardUpAfterDeal) {
      actions.push(new Action({
        gameId: this.gameId,
        creatorId: Meteor.userId(),
        actionType: ActionType.DECK_TO_PILE
      }));
    }

    this.pushActions(actions);

  }
  
  showHand(fromPlayerId:string=Meteor.userId()):void{
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.ALL,
      fromPlayerId: fromPlayerId,
      actionType: ActionType.HAND_TO_TABLE,
      cards: this.getHandFromUserId(fromPlayerId).cardsInHand
    });
    this.pushAction(action);
    
  }

  cardToTable(suit:CardSuit, rank:CardRank, visibilityType:VisibilityType, fromPlayerId:string=Meteor.userId()):void {
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      visibilityType: visibilityType,
      fromPlayerId: fromPlayerId,
      actionType: ActionType.HAND_TO_TABLE,
      cards: [new Card({suit:suit, rank:rank})]
    });
    this.pushAction(action);
  }
  
  deckToHand(visibilityType:VisibilityType, toPlayerId:string=Meteor.userId()):void {
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      visibilityType: visibilityType,
      toPlayerId: toPlayerId,
      actionType: ActionType.DECK_TO_HAND,
      cards: [this.tableFaceDown[0]]
    });
    this.pushAction(action);
  }

  handToPile(suit:CardSuit, rank:CardRank, fromPlayerId:string=Meteor.userId()):void {
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      fromPlayerId: fromPlayerId,
      actionType: ActionType.HAND_TO_PILE,
      cards: [new Card({suit:suit, rank:rank})]
    });
    this.pushAction(action);
  }

  pileToHand(suit:CardSuit, rank:CardRank, toPlayerId:string=Meteor.userId()):void {
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      toPlayerId: toPlayerId,
      actionType: ActionType.PILE_TO_HAND,
      cards: [new Card({suit:suit, rank:rank})]
    });
    this.pushAction(action);
  }


  sortHand(cards:Card[], toPlayerId:string=Meteor.userId()):void {
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      toPlayerId: toPlayerId,
      actionType: ActionType.HAND_SORT,
      cards: cards
    });
    this.pushAction(action);
  }

  pileToDeck(cards:Card[]) {
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      actionType: ActionType.PILE_TO_DECK,
      cards: cards
    });
    this.pushAction(action);
  }

  handToDeck(suit:CardSuit, rank:CardRank, fromPlayerId:string=Meteor.userId()) {
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      fromPlayerId: fromPlayerId,
      actionType: ActionType.HAND_TO_DECK,
      cards: [new Card({suit:suit, rank:rank})]
    });
    this.pushAction(action);
  }

  tableToHand(suit:CardSuit, rank:CardRank, toPlayerId:string=Meteor.userId()):void {
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      toPlayerId: toPlayerId,
      actionType: ActionType.TABLE_TO_HAND,
      cards: [new Card({suit:suit, rank:rank})]
    });
    this.pushAction(action);
  }
  
  trickReady():boolean {
    for (let i = 0; i<this.hands.length; i++ ) {
      let hand:Hand = this.hands[i];
      if (hand.cardsFaceUp.length!==1)
        return false;
    }
    return true;
  }

  takeTrick(toPlayerId:string=Meteor.userId()):void {
    if (!this.trickReady())
      throw new Meteor.Error('all-users-must-have-1-card-on-table', "All the users must have 1 card on the table for you to take thr trick");
    let trick:Card[] = [];
    this.hands.forEach((hand:Hand)=>{
      trick.push(hand.cardsFaceUp[0]);
    });
    let action:Action = new Action({
      gameId: this.gameId,
      creatorId: Meteor.userId(),
      toPlayerId: toPlayerId,
      actionType: ActionType.TAKE_TRICK,
      cards: trick
    });
    this.pushAction(action);

  }

  undo(actionId:string) {
    this.pushAction(
      new Action({actionType: ActionType.UNDO, gameId:this.gameId, creatorId: Meteor.userId(), relatedActionId:actionId})
    );
  }
}