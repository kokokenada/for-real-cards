/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { makeTypedFactory } from 'typed-immutable-record';
import { List } from "immutable";

import * as log from 'loglevel';

import {IGamePlayActionPayload, IGamePlayRecord, IGamePlayState } from "./game-play.types";
import {IPayloadAction} from "../../../../common-app";
import {GamePlayActions} from "./game-play-actions.class";
import {GamePlayAction, GamePlayActionType, VisibilityType} from "../../../api/models/action.model";
import {GameConfig} from "../../../api/models/game-config";
import {Card} from "../../../api/models/card.model";
import {Hand} from "../../../api/models/hand.model";
import {Deck} from "../../../api/models/deck.model";

export const GamePlayFactory = makeTypedFactory<IGamePlayState, IGamePlayRecord>({
  gameId: '',
  hands: List<Hand>(),
  handsOnServer: List<Hand>(),
  tableFaceDown: List<Card>(),
  tablePile: List<Card>(),
  lastNotified: null,
  actions: List<GamePlayAction>(),
  currentGameConfig: GameConfig.getDefaultConfig(),
  undoneIds: List<string>()
});

export const INITIAL_STATE = GamePlayFactory();

export function gamePlayReducer(
  oldState: IGamePlayRecord = INITIAL_STATE,
  action: IPayloadAction) {

  let payload:IGamePlayActionPayload = action.payload;
  let gamePlayAction:GamePlayAction = payload.gamePlayAction;
  gamePlayAction.sequencePosition = oldState.actions.size;

  // Add action to actions history and make a copy of oldState for modification
  let newState:IGamePlayRecord = oldState.set('actions', oldState.actions.push(gamePlayAction));

  switch (action.type) {
    case GamePlayActions.GAME_PLAY_ACTION_RECIEVED:
      if (GamePlayActions.isUndone(newState, gamePlayAction)) {
        //log.debug('not doing gamePlayAction because it is undone');
        return newState;
      }
      switch (gamePlayAction.actionType)  {
        case GamePlayActionType.SET_GAME_ID:
          newState.set('gameId', gamePlayAction.gameId);
          break;
        case GamePlayActionType.RESET:
          let oldHands = newState.hands;
          newState.set('hands', List<Hand>());
          oldHands.forEach((oldHand:Hand)=> {
            let hand = new Hand(oldHand);
            hand.cardsFaceDown = [];
            hand.cardsFaceUp = [];
            hand.cardsInHand = [];
            hand.tricks = [];
            newState.hands.push(hand);
          });
          newState.tableFaceDown = List<Card>();
          newState.tablePile = List<Card>();
          break;
        case GamePlayActionType.DEAL:

          let gameConfig:GameConfig = gamePlayAction.gameConfig;
          if (gameConfig) {
            newState.currentGameConfig = gameConfig;  // TODO: Check immutability of gameConfig
          } else {
            log.error('Expected gameConfig in DEAL gamePlayAction type');
            log.error(gamePlayAction);
            throw 'deal gamePlayAction missing config';
          }
          // Add cards to table & shuffle
          newState.set('tableFaceDown', List(gamePlayAction.cards));
          break;
        case GamePlayActionType.NEW_HAND:
          newState.set('hands', newState.hands.push(new Hand(payload.newHand)));
          break;
        case GamePlayActionType.DECK_TO_HAND:
          if ( checkCards(gamePlayAction) ) {

            let newHand:Hand = getHandForWriting(newState, gamePlayAction.toPlayerId);
            gamePlayAction.cards.forEach((card: Card)=> {
              let index: number = getIndexOfCard(newState.tableFaceDown, card);
              let cardToDeal: Card = newState.tableFaceDown.get(index);
              switch (gamePlayAction.visibilityType) {
                case VisibilityType.PLAYER:
                  newHand.cardsInHand.push(cardToDeal);
                  break;
                case VisibilityType.ALL:
                  newHand.cardsFaceUp.push(cardToDeal);
                  break;
                case VisibilityType.NO_ONE:
                  newHand.cardsFaceDown.push(cardToDeal);
                  break;
                default:
                  log.error('Unexpected VisbilityType');
                  log.error(gamePlayAction);
              }
              newState.set('tableFaceDown', newState.tableFaceDown.splice(index, 1));
            });

          }
          break;
        case GamePlayActionType.HAND_TO_TABLE:  // From not shown in hand to table in front of player shown to all
        {
          let hand:Hand = getHandForWriting(newState, gamePlayAction.fromPlayerId);
          if (checkCards(gamePlayAction)) {
            gamePlayAction.cards.forEach((card:Card)=> {
              let index:number = getIndexOfCard(hand.cardsInHand, card);
              if (gamePlayAction.visibilityType === VisibilityType.ALL) {
                hand.cardsFaceUp.push(card);        // OK because Hand has been copied and is a standard array, not an immutable
                hand.cardsInHand.splice(index, 1);
              } else {
                log.error('Unexpected / unimplemented gamePlayAction.visibilityType');
                log.error(gamePlayAction);
              }
            })
          }
          break;
        }
        case GamePlayActionType.HAND_TO_PILE:
        {
          let hand:Hand = getHandForWriting(newState, gamePlayAction.fromPlayerId);
          if ( checkCards(gamePlayAction) ) {
            gamePlayAction.cards.forEach((card:Card)=> {
              let index:number = getIndexOfCard(hand.cardsInHand, card);
              newState.set('tablePile', newState.tablePile.push(card));
              hand.cardsInHand.splice(index, 1); // OK because Hand has been copied and is a standard array, not an immutable
            })
          }
          break;
        }
        case GamePlayActionType.DECK_TO_PILE:
        {
          let index = 0;
          newState.set('tablePile', newState.tablePile.push(newState.tableFaceDown.get(index)));
          newState.set('tableFaceDown', newState.tableFaceDown.splice(index, 1));
          break;
        }
        case GamePlayActionType.HAND_SORT:
        {
          let hand:Hand = getHandForWriting(newState, gamePlayAction.toPlayerId);
          let error:boolean = false;
          // Error checking to make sure sort if valud
          if (hand.cardsInHand.length!== gamePlayAction.cards.length) {
            log.error('Invalid sort, sort request count !== card count');
            //log.error(gamePlayAction);
            //console.trace();
            error=true;
          } else {

            // This is just a sanity check
            for (let i = 0; i < hand.cardsInHand.length; i++) {
              let foundCount = 0;
              let handCard:Card = hand.cardsInHand[i];
              for (let j=0; j <gamePlayAction.cards.length; j++) {
                let sortCard:Card = gamePlayAction.cards[j];
                if (handCard.rank===sortCard.rank && handCard.suit===sortCard.suit) {
                  foundCount++;
                }
              }
              if (foundCount !== 1) {
                log.error("Invalid sort, card mismatch");
                //log.error(gamePlayAction);
                //console.trace();
                error=true;
              }
            }
          }
          if (!error) {
            hand.cardsInHand = gamePlayAction.cards;  // Install new sort order
          } else {
            log.error('sort not saved')
          }
          break;
        }
        case GamePlayActionType.PILE_TO_HAND: {
          let hand:Hand = getHandForWriting(newState, gamePlayAction.toPlayerId);
          if ( checkCards(gamePlayAction) ) {
            gamePlayAction.cards.forEach((card:Card)=> { // Can this loop be collapsed into a single call?
              let index:number = getIndexOfCard(newState.tablePile, card);
              hand.cardsInHand.push(card);
              newState.set('tablePile', newState.tablePile.splice(index, 1));
            })
          }
          break;
        }
        case GamePlayActionType.PILE_TO_DECK: {
          if ( checkCards(gamePlayAction) ) {
            gamePlayAction.cards.forEach((card:Card)=> {  // Can this loop be collapsed into a single call?
              let index:number = getIndexOfCard(newState.tablePile, card);
              newState.set('tableFaceDown', newState.tableFaceDown.push(card));
              newState.set('tablePile', newState.tablePile.splice(index, 1));
            });
          }
          break;
        }
        case GamePlayActionType.HAND_TO_DECK: {
          let hand:Hand = getHandForWriting(newState, gamePlayAction.fromPlayerId);
          if ( checkCards(gamePlayAction) ) {
            gamePlayAction.cards.forEach((card:Card)=> {
              let index:number = getIndexOfCard(hand.cardsInHand, card);
              newState.set('tableFaceDown', newState.tableFaceDown.push(card));
              hand.cardsInHand.splice(index, 1);
            });
          }
          break;
        }
        case GamePlayActionType.TABLE_TO_HAND: { // Pick up visible card in front of player and put it in hand
          let hand:Hand = getHandForWriting(newState, gamePlayAction.toPlayerId);
          if ( checkCards(gamePlayAction) ) {
            gamePlayAction.cards.forEach((card:Card)=> {
              let index:number = getIndexOfCard(hand.cardsFaceUp, card);
              hand.cardsFaceUp.splice(index, 1);
              hand.cardsInHand.push(card);
            })
          }
          break;
        }
        case GamePlayActionType.TAKE_TRICK:
        {
          let error:boolean = false;

          // Error checking to make sure sort if valud
          if (newState.hands.size !== gamePlayAction.cards.length) {
            log.error('Invalid trick, not equal to numberof players');
            error = true;
          } else {
            newState.hands.forEach((eachHand:Hand)=> {
              if (eachHand.cardsFaceUp.length !== 1) {
                log.error('Error. Each player should have one card on the table');
                error = true;
              }
            });
          }
          if (!error) {
            let hand:Hand = getHandForWriting(newState, gamePlayAction.toPlayerId);
            hand.tricks.push(gamePlayAction.cards);
            newState.hands.forEach((eachHand:Hand)=> {
              let writeableEachHand = getHandForWriting(newState, eachHand.userId);
              writeableEachHand.cardsFaceUp.splice(0, 1);
            });
          }
          break;
        }
        case GamePlayActionType.UNDO: {
          let foundUndoAction:GamePlayAction = null;
          let playBackActions:GamePlayAction[] = [];
          let actionIdBeingUndone = gamePlayAction.relatedActionId;
          let index:number = payload.undoIndex;

          // Walk through actions from the UNDO backwards
          for (let i=index; i>=0; i--) {
            let actionBeingExamined:GamePlayAction = newState.actions.get(i);
            //this.debugOutput('examining undo (' + i.toString() + ')', actionBeingExamined);
            if (
              actionBeingExamined._id === actionIdBeingUndone ||           // The 'parent' gamePlayAction
              actionBeingExamined.relatedActionId===actionIdBeingUndone)   // A 'child' gamePlayAction
            {
              // This is an gamePlayAction being undone
              addUndone(newState, actionBeingExamined);
            } else if (actionBeingExamined._id===gamePlayAction._id ) {
              if (i===index && !foundUndoAction && actionBeingExamined.relatedActionId===actionIdBeingUndone) { // a sanity check
                // This the undo gamePlayAction we're working on
                foundUndoAction = actionBeingExamined;
              } else {
                log.error('unexpected state');
                log.error(actionBeingExamined);
                log.error(gamePlayAction);
              }
            } else if (actionBeingExamined.actionType===GamePlayActionType.RESET) {
              // This is the re-create start point

              // Reset
              playBackActions.push(actionBeingExamined);


              playBackActions.reverse();
              // And re-run actions since
              for (let j=0; j<playBackActions.length; j++) {
                let playBackAction = playBackActions[j];
                if (playBackAction.actionType!==GamePlayActionType.UNDO) {
                  // Don't try to re-proces UNDO's
                  this.processAction(playBackActions, j); // TODO: this won't work, fix it
                }
              }
              break; // We're done
            } else if (foundUndoAction) {
              // This is an gamePlayAction to recreate from last RESET
              playBackActions.push(actionBeingExamined);
            } else {
              // this is an gamePlayAction that has happened since the gamePlayAction being undone. Hmmm
              playBackActions.push(actionBeingExamined);
            }
          }
          break;
        }

        default:
          log.error("Unexpected gamePlayAction type");
          log.error(gamePlayAction);
          console.trace();
      }
      return newState;
  default:
      return oldState;
  }

}

function addUndone(state: IGamePlayRecord, action:GamePlayAction) {
  state.set('undoneIds', state.undoneIds.push(action._id));
}

function getHandIndexFromUserId(hands:List<Hand>, userId:string):number {
  return hands.findIndex( (hand:Hand)=> hand.userId===userId);
}

function getHandForWriting(newState:IGamePlayRecord, playerId:string):Hand {
  let handIndex:number = getHandIndexFromUserId(newState.hands, playerId);
  if (handIndex===-1) {
    log.error('toPlayerId is missing from gamePlayAction');
    console.trace();
  } else {
    let newHand: Hand = new Hand(newState.hands.get(handIndex));
    newState.set('hands', newState.hands.set(handIndex, newHand));
    return newHand;
  }
}

function getIndexOfCard(cards:List<Card>, card):number
function getIndexOfCard(cards:Card[], card):number
function getIndexOfCard(cards:any, card):number{
  let index: number = Deck.indexOf(cards, card);
  if (index === -1) {
    log.error('Could not find card');
    log.error(cards);
    log.error(card);
    console.trace();
  } else {
    return index;
  }
}

function checkCards(gamePlayAction:GamePlayAction):boolean {
  if (gamePlayAction.cards && gamePlayAction.cards.length > 0) {
    return true;
  }
  log.error('GamePlayAction no cards. Logging error and continuing');
  log.error(gamePlayAction);
  console.trace();
  return false;
}