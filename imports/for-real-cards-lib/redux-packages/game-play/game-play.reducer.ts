import { makeTypedFactory } from 'typed-immutable-record';
import {  List, OrderedMap} from "immutable";

import {GamePlayActions} from "./game-play-actions";
import {IGamePlayActionPayload, IGamePlayRecord } from "./game-play-payload-interface";
import {
  GamePlayAction, GamePlayActionType, VisibilityType,
  GamePlayActionInterface
} from './action.class';
import {DealLocation, DealSequence, GameConfig} from './game-config.class';
import {Card} from'./card.class';
import {Hand} from './hand.class';
import {Deck} from './deck.class';
import {IPayloadAction} from 'redux-package';
import {GamePlayFunctions} from "./game-play.functions";
import {IGamePlayState} from './game-play-state';

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
    gamePlayAction._id = counter.toString(); // side effect violation!
  }
  let id = gamePlayAction._id;
  if (readState.actions.get(id, undefined)) {
    // We've seen this action before, do not process
    return transient;
  }
  gamePlayAction.sequencePosition = transient.actions.size; // side effect violation
  gamePlayAction.previousState = transient.toJS();  // Temporary fix. TODO figure out a more performant way to copy the state and restore it in UNDO  // side effect violation
/*  console.group(GamePlayActionType[gamePlayAction.actionType]);
  console.log('PROCESSING GAME PLAY ACTION: ' + GamePlayActionType[gamePlayAction.actionType]);
  console.log('gamePlayAction.previousState:');
  console.log(gamePlayAction.previousState);
  console.log('gamePlayAction::');
  console.log(gamePlayAction);
  console.groupEnd();
  */
  transient.set('actions', transient.actions.set(id, gamePlayAction));
  if (GamePlayFunctions.isUndone(transient, gamePlayAction)) {
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
//        console.error('Expected gameConfig in DEAL gamePlayAction type');
//        console.error(gamePlayAction);
        throw 'deal gamePlayAction missing config';
      }
      // Add cards to table & shuffle
      transient.set('tableFaceDown', List(gamePlayAction.cards));
      break;
    case GamePlayActionType.NEW_HAND: {
      let newHand = new Hand(payload.newHand);
      let newHands: List<Hand> = readState.hands.push(newHand);
      transient.set('hands', newHands);
      break;
    }
    case GamePlayActionType.DEAL_STEP: {
      const dealSequence : DealSequence = GamePlayFunctions.currentDealStep(readState);
      let numberOfCards:number = dealSequence.maximumNumberOfCards; // TODO: Support variale # of cards
      if (dealSequence.dealLocation === DealLocation.CENTER_FACEUP_SHOWALL) {
        deckToPile(transient, readState, numberOfCards);
      }
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
              console.error('Unexpected VisbilityType');
              console.error(gamePlayAction);
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
            console.error('Unexpected / unimplemented gamePlayAction.visibilityType');
            console.error(gamePlayAction);
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
      deckToPile(transient, readState, 1);
      break;
    }
    case GamePlayActionType.HAND_SORT: {
      let hand: Hand = getHandForWriting(transient, gamePlayAction.toPlayerId);
      let error: boolean = false;
      // Error checking to make sure sort if valud
      if (hand.cardsInHand.length !== gamePlayAction.cards.length) {
        console.error('Invalid sort, sort request count !== card count');
        //console.error(gamePlayAction);
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
            console.error("Invalid sort, card mismatch");
            console.error(gamePlayAction);
            console.error(hand.cardsInHand);
            //console.trace();
            error = true;
          }
        }
      }
      if (!error) {
        hand.cardsInHand = gamePlayAction.cards;  // Install new sort order
      } else {
        console.error('sort not saved')
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
        console.error('Invalid trick, not equal to numberof players');
        error = true;
      } else {
        readState.hands.forEach((eachHand: Hand)=> {
          if (eachHand.cardsFaceUp.length !== 1) {
            console.error('Error. Each player should have one card on the table');
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
    case GamePlayActionType.BET:
    case GamePlayActionType.BUY:
    case GamePlayActionType.FOLD:
    case GamePlayActionType.TAKE_MONEY:
      break; // Calculating values from action history (experiment)
    default:
      console.error("Unexpected gamePlayAction type");
      console.error(gamePlayAction);
      console.trace();
  }
//  console.log('result:')
//  console.log(transient.toJS());
//  console.groupEnd();
  return transient;
}

function deckToPile(transient: IGamePlayRecord, readState: IGamePlayRecord, count:number) {
  let index = 0;
  for (let i=0; i < count; i++) {
    transient.set('tablePile', readState.tablePile.push(readState.tableFaceDown.get(index)));
    transient.set('tableFaceDown', readState.tableFaceDown.splice(index, 1));
  }
}

function addUndone(state: IGamePlayRecord, actionId: string) {
  state.set('undoneIds', state.undoneIds.push(actionId));
}


function getHandForWriting(transientState: IGamePlayRecord, playerId: string): Hand {
  let handIndex: number = GamePlayFunctions.getHandIndexFromUserId(transientState.hands, playerId);
  if (handIndex === -1) {
    console.error('cannot find playerId %s is hands', playerId);
    console.trace();
    return null;
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
    console.error('Could not find card');
    console.error(cards);
    console.error(card);
    return null;
  } else {
    return index;
  }
}

function checkCards(gamePlayAction: GamePlayAction): boolean {
  if (gamePlayAction.cards && gamePlayAction.cards.length > 0) {
    return true;
  }
  console.error('GamePlayAction no cards. Logging error and continuing');
  console.error(gamePlayAction);
  console.trace();
  return false;
}