/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {List} from "immutable";


import {IAppState, IPayloadAction} from '../../../../common-app';


import {GamePlayActionType} from "../../../api";
import {GamePlayAction, VisibilityType} from "../../../api/models/action.model";
import {GameConfig} from "../../../api/models/game-config";
import {Deck} from "../../../api/models/deck.model";
import {Card, CardSuit, CardRank} from "../../../api/models/card.model";
import {AccountTools} from "../../../../common-app/src/ui/services/account-tools";
import {IGamePlayState} from "./game-play.types";
import {Hand, HandInterface} from "../../../api/models/hand.model";
import {BaseApp} from "../../../../common-app/src/ui/redux/base-app.class";

const _prefix = 'FRC_GAMEPLAY_';
const _prefix_length = _prefix.length;

@Injectable()
export class GamePlayActions {
  private static prefix = _prefix;
  static GAME_PLAY_INITIALIZE = GamePlayActions.prefix + 'GAME_PLAY_INITIALIZE';
  static GAME_PLAY_ACTION_RECIEVED = GamePlayActions.prefix + 'GAME_PLAY_ACTION_RECIEVED';
  static GAME_PLAY_ACTIONSSS_RECIEVED = GamePlayActions.prefix + 'GAME_PLAY_ACTIONSSS_RECIEVED';
  static GAME_PLAY_ACTION_PUSH = GamePlayActions.prefix + 'GAME_PLAY_ACTION_PUSH';
  static GAME_PLAY_ACTIONSSS_PUSH = GamePlayActions.prefix + 'GAME_PLAY_ACTIONSSS_PUSH'; // Triple S to be more distinctive than singluar form
  static GAME_PLAY_ERROR = GamePlayActions.prefix + 'GAME_PLAY_ERROR';

  constructor(private ngRedux: NgRedux<IAppState>) {
  }

  static isGamePlayAction(actionType:string) : boolean {
    return actionType.substr(0, _prefix_length) === _prefix;
  }

  /**
   * Sets game Id and kicks off watching for data changes
   * @param gameId
   */
  initialize(gameId:string) : void {
    this.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_INITIALIZE, payload: {gameId: gameId}});
  }

  /**
   * Writes an action to the database
   * @param action
   */
  private pushAction(action: GamePlayAction): void {
    this.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_ACTION_PUSH, payload: {gamePlayAction: action}});
  }

  /**
   * Writes an array of actions to the database
   * @param actions
   */
  private pushActions(actions: GamePlayAction[]): void {
    this.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_ACTIONSSS_PUSH, payload: {gamePlayActions: actions}});
  }

  /**
   * Processes an action locally
   * @param action
   */
  receiveAction(action: GamePlayAction) {
    this.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED, payload: {gamePlayAction: action}});
  }

  /**
   * Processes an actions locally
   * @param actions
   */
  receiveActions(actions: GamePlayAction[]) {
    this.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_ACTIONSSS_RECIEVED, payload: {gamePlayActions: actions}});
  }


  setGameId(gameId:string) : void {
    this.ngRedux.dispatch(
      {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            gameId: gameId,
            creatorId: AccountTools.userId(),
            actionType: GamePlayActionType.SET_GAME_ID
          }
        }
      }
    );
  }

  newHand(gameId:string, hand:HandInterface) {
    this.ngRedux.dispatch(
      {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            gameId: gameId,
            creatorId: AccountTools.userId(),
            actionType: GamePlayActionType.NEW_HAND
          },
          newHand: hand
        }
      }
    );
  }

  deal(gameState: IGamePlayState, gameConfig: GameConfig) {

    this.pushAction(new GamePlayAction({  // Push RESET separately because it is a different undo block
      gameId: gameState.gameId,
      creatorId: AccountTools.userId(),
      actionType: GamePlayActionType.RESET
    }));

    let actions: GamePlayAction[] = [];
    let initializeAction: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: AccountTools.userId(),
      actionType: GamePlayActionType.DEAL,
      gameConfig: gameConfig
    });

    // Add cards to table
    let deck: Deck = gameConfig.deck;
    if (!deck) {
      log.error('Expected deck to be defined in gameConfig in DEAL action type');
      console.trace();
      throw 'Expected deck to be defined in gameConfig in DEAL action type';
    }

    // Add cards to initialization action & shuffle
    deck.cards.forEach((card: Card)=> {
      initializeAction.cards.push(card);
    });
    Deck.shuffle(new Date().toUTCString() + gameState.gameId, initializeAction.cards);
    actions.push(initializeAction);

    // Give cards to players
    let deckPosition = 0;
    gameState.hands.forEach((hand: Hand)=> {
      if (gameConfig.numberOfCardsToPlayer > 0) {
        let toPlayerAction: GamePlayAction = new GamePlayAction({
          gameId: gameState.gameId,
          creatorId: Meteor.userId(),
          actionType: GamePlayActionType.DECK_TO_HAND,
          visibilityType: VisibilityType.PLAYER,
          toPlayerId: hand.userId
        });
        for (let i = 0; i < gameConfig.numberOfCardsToPlayer; i++) {
          toPlayerAction.cards.push(initializeAction.cards[deckPosition++]);
        }
        actions.push(toPlayerAction);
      }

      if (gameConfig.numberOfCardsToPlayerFaceUp > 0) {
        let toPlayerAction: GamePlayAction = new GamePlayAction({
          gameId: gameState.gameId,
          creatorId: Meteor.userId(),
          actionType: GamePlayActionType.DECK_TO_HAND,
          visibilityType: VisibilityType.ALL,
          toPlayerId: hand.userId
        });
        for (let i = 0; i < gameConfig.numberOfCardsToPlayerFaceUp; i++) {
          toPlayerAction.cards.push(initializeAction.cards[deckPosition++]);
        }
        actions.push(toPlayerAction);
      }
    });
    if (gameConfig.turnCardUpAfterDeal) {
      actions.push(new GamePlayAction({
        gameId: gameState.gameId,
        creatorId: Meteor.userId(),
        actionType: GamePlayActionType.DECK_TO_PILE
      }));
    }

    this.pushActions(actions);

  }

  deckToHand(gameState: IGamePlayState, visibilityType: VisibilityType, toPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: visibilityType,
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.DECK_TO_HAND,
      cards: [gameState.tableFaceDown.get(0)]
    });
    this.pushAction(action);
  }


  showHand(gameState: IGamePlayState, fromPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.ALL,
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_TABLE,
      cards: GamePlayActions.getHandFromUserId(gameState.hands, fromPlayerId).cardsInHand
    });
    this.pushAction(action);

  }

  cardToTable(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, visibilityType: VisibilityType, fromPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: visibilityType,
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_TABLE,
      cards: [new Card({suit: suit, rank: rank})]
    });
    this.pushAction(action);
  }


  handToPile(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, fromPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_PILE,
      cards: [new Card({suit: suit, rank: rank})]
    });
    this.pushAction(action);
  }

  pileToHand(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, toPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.PILE_TO_HAND,
      cards: [new Card({suit: suit, rank: rank})]
    });
    this.pushAction(action);
  }

  sortHand(gameState: IGamePlayState, cards: Card[], toPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.HAND_SORT,
      cards: cards
    });
    this.pushAction(action);
  }

  pileToDeck(gameState: IGamePlayState, cards: Card[]) {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      actionType: GamePlayActionType.PILE_TO_DECK,
      cards: cards
    });
    this.pushAction(action);
  }

  handToDeck(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, fromPlayerId: string = Meteor.userId()) {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_DECK,
      cards: [new Card({suit: suit, rank: rank})]
    });
    this.pushAction(action);
  }

  tableToHand(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, toPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.TABLE_TO_HAND,
      cards: [new Card({suit: suit, rank: rank})]
    });
    this.pushAction(action);
  }


  static trickReady(gameState: IGamePlayState): boolean {
    for (let i = 0; i < gameState.hands.size; i++) {
      let hand: Hand = gameState.hands.get(i);
      if (hand.cardsFaceUp.length !== 1)
        return false;
    }
    return true;
  }

  takeTrick(gameState: IGamePlayState, toPlayerId: string = Meteor.userId()): void {
    if (!GamePlayActions.trickReady(gameState))
      throw new Meteor.Error('all-users-must-have-1-card-on-table', "All the users must have 1 card on the table for you to take thr trick");
    let trick: Card[] = [];
    gameState.hands.forEach((hand: Hand)=> {
      trick.push(hand.cardsFaceUp[0]);
    });
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.TAKE_TRICK,
      cards: trick
    });
    this.pushAction(action);

  }

  static getHandFromUserId(hands: List<Hand>, userId: string): Hand {
    return hands.find((hand: Hand)=> hand.userId === userId);
  }


  static isUndone(state: IGamePlayState, action: GamePlayAction): boolean {
    return state.undoneIds.indexOf(action._id) !== -1;
  }

  static isUndoable(state: IGamePlayState, action: GamePlayAction): boolean {
    switch (action.actionType) {
      case GamePlayActionType.HAND_SORT:
      case GamePlayActionType.NEW_HAND:
      case GamePlayActionType.UNDO:
      case GamePlayActionType.SET_GAME_ID:
        return false;
      default: {
        if (action.relatedActionId) // If has a related actionId then can't undo because it is like a child action
          return false;
        return !GamePlayActions.isUndone(state, action); // Don't undo twice
      }
    }
  }

  static actionToUndo(gameState: IGamePlayState): GamePlayAction {
    // Walk through actions from latest
    if (gameState.actions) {
      for (let i = gameState.actions.size - 1; i >= 0; i--) {
        let actionBeingExamined: GamePlayAction = gameState.actions.get(i);
        if (GamePlayActions.isUndoable(gameState, actionBeingExamined)) {
//          this.debugOutput('identified undo action', actionBeingExamined);
          return actionBeingExamined;
        }
      }
    }
  }

  undo(gameState: IGamePlayState, actionId: string) {
    this.pushAction(
      new GamePlayAction({
        actionType: GamePlayActionType.UNDO,
        gameId: gameState.gameId,
        creatorId: Meteor.userId(),
        relatedActionId: actionId
      })
    );
  }

  error(error) {
    this.ngRedux.dispatch(
      BaseApp.errorFactory(GamePlayActions.GAME_PLAY_ERROR, {error:error.error})
    );
  }
}
