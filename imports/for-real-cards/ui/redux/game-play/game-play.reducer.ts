import { makeTypedFactory } from 'typed-immutable-record';
import {  List, OrderedMap} from "immutable";

import * as log from 'loglevel';

import {IGamePlayActionPayload, IGamePlayRecord, IGamePlayState} from "./game-play.types";
import {GamePlayActions} from "./game-play-actions.class";
import {
  GamePlayAction, GamePlayActionType, VisibilityType,
  GamePlayActionInterface
} from "../../../api/models/action.model";
import {GameConfig} from "../../../api/models/game-config";
import {Card} from "../../../api/models/card.model";
import {Hand} from "../../../api/models/hand.model";
import {Deck} from "../../../api/models/deck.model";
import {IPayloadAction} from "../../../../common-app/src/ui/redux/action.interface";
import {GamePlayFunctions} from "./game-play.functions";

export const GamePlayFactory = makeTypedFactory<IGamePlayState, IGamePlayRecord>({
  gameId: '',
  hands: List<Hand>(),
  tableFaceDown: List<Card>(),
  tablePile: List<Card>(),
  actions: OrderedMap<string, GamePlayAction>(),
  currentGameConfig: GameConfig.getDefaultConfig(),
  undoneIds: List<string>(),
  idCounter:0
});

export const INITIAL_STATE_GAME_PLAY = GamePlayFactory();

export function gamePlayReducer(oldState: IGamePlayRecord = INITIAL_STATE_GAME_PLAY,
                                action: IPayloadAction) {

  if (!GamePlayActions.isGamePlayAction(action.type))
    return oldState;

  let payload: IGamePlayActionPayload = action.payload;
  if (!payload)
    return oldState;
  let gamePlayAction: GamePlayAction = payload.gamePlayAction;
  let returnState: IGamePlayRecord = oldState.withMutations( (transient:IGamePlayRecord)=>{
    switch (action.type) {
      case GamePlayActions.GAME_PLAY_ACTION_RECIEVED: {
        transient = processGamePlayAction(transient, gamePlayAction, payload);
        break;
      }
      case GamePlayActions.GAME_PLAY_ACTIONSSS_RECIEVED: {
        let gamePlayActions: GamePlayActionInterface[] = payload.gamePlayActions;
        gamePlayActions.forEach((gamePlayAction:GamePlayAction)=>{
          transient = processGamePlayAction(transient, gamePlayAction, payload);
        });
        break;
      }
    }
  });
  return returnState;
}

function processGamePlayAction(transient: IGamePlayRecord, gamePlayAction: GamePlayAction, payload: IGamePlayActionPayload):IGamePlayRecord {
  let readState: IGamePlayRecord = transient; // Just so one variable is read (readState) and the other (transient) is wrriten
  if (!gamePlayAction._id) {
    let counter:number = readState.idCounter + 1;
    transient.set('idCounter', counter);
    gamePlayAction._id = counter.toString();
  }
  let id = gamePlayAction._id;
  if (readState.actions.get(id, undefined)) {
    // We've seen this action before, do not process
    return transient;
  }
  gamePlayAction.sequencePosition = transient.actions.size;
  gamePlayAction.previousState = transient.toJS();  // Temporary fix. TODO figure out a more performant way to copy the state and restore it in UNDO
//  console.group(GamePlayActionType[gamePlayAction.actionType]);
//  console.log('PROCESSING GAME PLAY ACTION: ' + GamePlayActionType[gamePlayAction.actionType]);
//  console.log('gamePlayAction.previousState:')
//  console.log(gamePlayAction.previousState)
//  console.log('gamePlayAction::')
//  console.log(gamePlayAction);
  transient.set('actions', transient.actions.set(id, gamePlayAction));
  if (GamePlayActions.isUndone(transient, gamePlayAction)) {
//    console.log('not doing gamePlayAction because it is undone');
//    console.groupEnd();
    return transient;
  }

  switch (gamePlayAction.actionType) {
    case GamePlayActionType.NEW_GAME:
      transient.set('gameId', gamePlayAction.gameId);
      transient.set('hands', List<Hand>());
      transient.set('tableFaceDown', List<Card>());
      transient.set('tablePile', List<Card>());
      transient.set('actions', OrderedMap<string, GamePlayAction>());
      break;
    case GamePlayActionType.RESET: {
      let oldHands = readState.hands;
      let newHands: Hand[] = [];
      oldHands.forEach((oldHand: Hand)=> {
        let hand = new Hand(oldHand);
        hand.cardsFaceDown = [];
        hand.cardsFaceUp = [];
        hand.cardsInHand = [];
        hand.tricks = [];
        newHands.push(hand);
      });

      transient.set('hands', List<Hand>(newHands));
      transient.set('tableFaceDown', List<Card>());
      transient.set('tablePile', List<Card>());
      break;
    }
    case GamePlayActionType.DEAL:

      let gameConfig: GameConfig = gamePlayAction.gameConfig;
      if (gameConfig) {
        transient.set('currentGameConfig', gameConfig);
      } else {
        log.error('Expected gameConfig in DEAL gamePlayAction type');
        log.error(gamePlayAction);
        throw 'deal gamePlayAction missing config';
      }
      // Add cards to table & shuffle
      transient.set('tableFaceDown', List(gamePlayAction.cards));
      break;
    case GamePlayActionType.NEW_HAND: {
      let newHand = new Hand(payload.newHand);
      let newHands: List<Hand> = readState.hands.push(newHand);
//      console.log(newHand)
//      console.log(newHands.toArray());
      transient.set('hands', newHands);
      break;
    }
    case GamePlayActionType.DECK_TO_HAND:
      if (checkCards(gamePlayAction)) {

        let newHand: Hand = getHandForWriting(transient, gamePlayAction.toPlayerId);
        gamePlayAction.cards.forEach((card: Card)=> {
          let index: number = getIndexOfCard(readState.tableFaceDown, card);
          let cardToDeal: Card = readState.tableFaceDown.get(index);
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
          transient.set('tableFaceDown', readState.tableFaceDown.splice(index, 1));
        });

      }
      break;
    case GamePlayActionType.HAND_TO_TABLE:  // From not shown in hand to table in front of player shown to all
    {
      let hand: Hand = getHandForWriting(transient, gamePlayAction.fromPlayerId);
      if (checkCards(gamePlayAction)) {
        gamePlayAction.cards.forEach((card: Card)=> {
          let index: number = getIndexOfCard(hand.cardsInHand, card);
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
    case GamePlayActionType.HAND_TO_PILE: {
      let hand: Hand = getHandForWriting(transient, gamePlayAction.fromPlayerId);
      if (checkCards(gamePlayAction)) {
        gamePlayAction.cards.forEach((card: Card)=> {
          let index: number = getIndexOfCard(hand.cardsInHand, card);
          transient.set('tablePile', readState.tablePile.push(card));
          hand.cardsInHand.splice(index, 1); // OK because Hand has been copied and is a standard array, not an immutable
        })
      }
      break;
    }
    case GamePlayActionType.DECK_TO_PILE: {
      let index = 0;
      transient.set('tablePile', readState.tablePile.push(readState.tableFaceDown.get(index)));
      transient.set('tableFaceDown', readState.tableFaceDown.splice(index, 1));
      break;
    }
    case GamePlayActionType.HAND_SORT: {
      let hand: Hand = getHandForWriting(transient, gamePlayAction.toPlayerId);
      let error: boolean = false;
      // Error checking to make sure sort if valud
      if (hand.cardsInHand.length !== gamePlayAction.cards.length) {
        log.error('Invalid sort, sort request count !== card count');
        //log.error(gamePlayAction);
        //console.trace();
        error = true;
      } else {

        // This is just a sanity check
        for (let i = 0; i < hand.cardsInHand.length; i++) {
          let foundCount = 0;
          let handCard: Card = hand.cardsInHand[i];
          for (let j = 0; j < gamePlayAction.cards.length; j++) {
            let sortCard: Card = gamePlayAction.cards[j];
            if (handCard.rank === sortCard.rank && handCard.suit === sortCard.suit) {
              foundCount++;
            }
          }
          if (foundCount !== 1) {
            log.error("Invalid sort, card mismatch");
            //log.error(gamePlayAction);
            //console.trace();
            error = true;
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
      let hand: Hand = getHandForWriting(transient, gamePlayAction.toPlayerId);
      if (checkCards(gamePlayAction)) {
        gamePlayAction.cards.forEach((card: Card)=> { // Can this loop be collapsed into a single call?
          let index: number = getIndexOfCard(readState.tablePile, card);
          hand.cardsInHand.push(card);
          transient.set('tablePile', readState.tablePile.splice(index, 1));
        })
      }
      break;
    }
    case GamePlayActionType.PILE_TO_DECK: {
      if (checkCards(gamePlayAction)) {
        gamePlayAction.cards.forEach((card: Card)=> {  // Can this loop be collapsed into a single call?
          let index: number = getIndexOfCard(readState.tablePile, card);
          transient.set('tableFaceDown', readState.tableFaceDown.push(card));
          transient.set('tablePile', readState.tablePile.splice(index, 1));
        });
      }
      break;
    }
    case GamePlayActionType.HAND_TO_DECK: {
      let hand: Hand = getHandForWriting(transient, gamePlayAction.fromPlayerId);
      if (checkCards(gamePlayAction)) {
        gamePlayAction.cards.forEach((card: Card)=> {
          let index: number = getIndexOfCard(hand.cardsInHand, card);
          transient.set('tableFaceDown', readState.tableFaceDown.push(card));
          hand.cardsInHand.splice(index, 1);
        });
      }
      break;
    }
    case GamePlayActionType.TABLE_TO_HAND: { // Pick up visible card in front of player and put it in hand
      let hand: Hand = getHandForWriting(transient, gamePlayAction.toPlayerId);
      if (checkCards(gamePlayAction)) {
        gamePlayAction.cards.forEach((card: Card)=> {
          let index: number = getIndexOfCard(hand.cardsFaceUp, card);
          hand.cardsFaceUp.splice(index, 1);
          hand.cardsInHand.push(card);
        })
      }
      break;
    }
    case GamePlayActionType.TAKE_TRICK: {
      let error: boolean = false;

      // Error checking to make sure sort if valud
      if (readState.hands.size !== gamePlayAction.cards.length) {
        log.error('Invalid trick, not equal to numberof players');
        error = true;
      } else {
        readState.hands.forEach((eachHand: Hand)=> {
          if (eachHand.cardsFaceUp.length !== 1) {
            log.error('Error. Each player should have one card on the table');
            error = true;
          }
        });
      }
      if (!error) {
        let hand: Hand = getHandForWriting(transient, gamePlayAction.toPlayerId);
        hand.tricks.push(gamePlayAction.cards);
        readState.hands.forEach((eachHand: Hand)=> {
          let writeableEachHand = getHandForWriting(transient, eachHand.userId);
          writeableEachHand.cardsFaceUp.splice(0, 1);
        });
      }
      break;
    }
    case GamePlayActionType.UNDO: {
      let actionIdBeingUndone = gamePlayAction.relatedActionId;
      addUndone(readState, actionIdBeingUndone);
      let foundUndoAction = readState.actions.get(actionIdBeingUndone);
      console.log('foundUndoAction')
      console.log(foundUndoAction)
      console.log(foundUndoAction.previousState)
      let handList = List();
      foundUndoAction.previousState.hands.forEach( (o)=>{
        console.log(o)
        handList = handList.push(new Hand(o));
      })
      console.log(handList.toJS())
      transient.set('hands', handList);
      transient.set('tableFaceDown', List(foundUndoAction.previousState.tableFaceDown));
      transient.set('tablePile', List(foundUndoAction.previousState.tablePile));
      transient.set('currentGameConfig', new GameConfig(foundUndoAction.previousState.currentGameConfig));


      /*      foundUndoAction.previousState.forEach( (value:any, key:string)=>{
              // To preserve the UNDO history and allow for a redo, we'll only rollback part of the state
              if (key!=='actions' && key !=='undoneIds' && key!=='idCounter') {
                transient.set(key, value);
                console.log('transient.set(key, value);')
                console.log(key)
                console.log(value)
              }
            });*/
      break;
    }

    default:
      log.error("Unexpected gamePlayAction type");
      log.error(gamePlayAction);
      console.trace();
  }
//  console.log('result:')
//  console.log(transient.toJS());
//  console.groupEnd();
  return transient;
}

function addUndone(state: IGamePlayRecord, actionId: string) {
  state.set('undoneIds', state.undoneIds.push(actionId));
}


function getHandForWriting(transientState: IGamePlayRecord, playerId: string): Hand {
  let handIndex: number = GamePlayFunctions.getHandIndexFromUserId(transientState.hands, playerId);
  if (handIndex === -1) {
    log.error('cannot find playerId %s is hands', playerId);
    console.trace();
  } else {
    let newHand: Hand = new Hand(transientState.hands.get(handIndex));
    newHand.cardsFaceDown = newHand.cardsFaceDown.slice(); // This is inefficient.  Would be better as immutable.js objects
    newHand.cardsFaceUp = newHand.cardsFaceUp.slice();
    newHand.cardsInHand = newHand.cardsInHand.slice();
    newHand.tricks = JSON.parse(JSON.stringify(newHand.tricks));
    transientState.set('hands', transientState.hands.set(handIndex, newHand));
    return newHand;
  }
}

function getIndexOfCard(cards: List<Card>, card): number
function getIndexOfCard(cards: Card[], card): number
function getIndexOfCard(cards: any, card): number {
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

function checkCards(gamePlayAction: GamePlayAction): boolean {
  if (gamePlayAction.cards && gamePlayAction.cards.length > 0) {
    return true;
  }
  log.error('GamePlayAction no cards. Logging error and continuing');
  log.error(gamePlayAction);
  console.trace();
  return false;
}