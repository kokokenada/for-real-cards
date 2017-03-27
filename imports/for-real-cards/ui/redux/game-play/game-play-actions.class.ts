import {List} from "immutable";
import * as log from 'loglevel';

import { Card, CardSuit, CardRank, Deck, GameConfig, GamePlayActionType, GamePlayAction, Hand, HandInterface, VisibilityType } from "../../../api";
import { IGamePlayState } from "./game-play.types";
import {AccountTools} from "../../../../common-app/src/ui/services/account-tools";
import {ReduxModuleUtil} from "../../../../common-app/src/ui/redux/redux-module-util";
import {ReduxModuleCombiner} from "../../../../common-app/src/ui/redux/redux-module-combiner";
import {DealSequence, DealLocation} from "../../../api/models/game-config";

const _prefix = 'FRC_GAMEPLAY_';
const _prefix_length = _prefix.length;

export class GamePlayActions {
  private static prefix = _prefix;
  static GAME_PLAY_INITIALIZE = GamePlayActions.prefix + 'GAME_PLAY_INITIALIZE';
  static GAME_PLAY_ACTION_RECIEVED = GamePlayActions.prefix + 'GAME_PLAY_ACTION_RECIEVED';
  static GAME_PLAY_ACTIONSSS_RECIEVED = GamePlayActions.prefix + 'GAME_PLAY_ACTIONSSS_RECIEVED';
  static GAME_PLAY_ACTION_PUSH = GamePlayActions.prefix + 'GAME_PLAY_ACTION_PUSH';
  static GAME_PLAY_ACTIONSSS_PUSH = GamePlayActions.prefix + 'GAME_PLAY_ACTIONSSS_PUSH'; // Triple S to be more distinctive from singluar form
  static GAME_PLAY_ERROR = GamePlayActions.prefix + 'GAME_PLAY_ERROR';

  static isGamePlayAction(actionType: string): boolean {
    return actionType.substr(0, _prefix_length) === _prefix;
  }

  /**
   * Sets game Id and kicks off watching for data changes
   * @param gameId
   */
  static initialize(gameId: string): void {
    let newGameAction: GamePlayAction = new GamePlayAction({
      gameId: gameId,
      creatorId: AccountTools.userId(),
      actionType: GamePlayActionType.NEW_GAME
    });
    ReduxModuleCombiner.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_INITIALIZE, payload: {gameId}});
    this.receiveAction(newGameAction);
  }

  /**
   * Writes an action to the database
   * @param action
   */
  private static pushAction(action: GamePlayAction): void {
    ReduxModuleCombiner.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_ACTION_PUSH, payload: {gamePlayAction: action}});
  }

  /**
   * Writes an array of actions to the database
   * @param actions
   */
  private static pushActions(actions: GamePlayAction[]): void {
    ReduxModuleCombiner.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_ACTIONSSS_PUSH, payload: {gamePlayActions: actions}});
  }

  /**
   * Processes an action locally
   * @param action
   */
  static receiveAction(action: GamePlayAction) {
    ReduxModuleCombiner.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED, payload: {gamePlayAction: action}});
  }

  /**
   * Processes an actions locally
   * @param actions
   */
  static receiveActions(actions: GamePlayAction[]) {
    ReduxModuleCombiner.ngRedux.dispatch({type: GamePlayActions.GAME_PLAY_ACTIONSSS_RECIEVED, payload: {gamePlayActions: actions}});
  }

  static newHand(gameId: string, hand: HandInterface) {
    ReduxModuleCombiner.ngRedux.dispatch(
      {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            _id: 'newhand:' + hand._id, // Ensure gamePlayAction has unique ID to prevent double processing
            gameId: gameId,
            creatorId: AccountTools.userId(),
            toPlayerId: hand.userId,
            actionType: GamePlayActionType.NEW_HAND
          },
          newHand: hand
        }
      }
    );
  }

  static deal(gameState: IGamePlayState, gameConfig: GameConfig) {

    GamePlayActions.pushAction(new GamePlayAction({  // Push RESET separately because it is a different undo block
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
      let dealSequence:DealSequence = gameConfig.dealSequence[0]; // TODO: Figure out which sequence we are in
      let numberOfCards:number = dealSequence.maximumNumberOfCards; // TODO: Support variale # of cards
      if (dealSequence.dealLocation===DealLocation.HAND_HIDDEN) {
        let toPlayerAction: GamePlayAction = new GamePlayAction({
          gameId: gameState.gameId,
          creatorId: Meteor.userId(),
          actionType: GamePlayActionType.DECK_TO_HAND,
          visibilityType: VisibilityType.PLAYER,
          toPlayerId: hand.userId
        });
        for (let i = 0; i < numberOfCards; i++) {
          toPlayerAction.cards.push(initializeAction.cards[deckPosition++]);
        }
        actions.push(toPlayerAction);
      }

      if (dealSequence.dealLocation===DealLocation.HAND_FACEUP) {
        let toPlayerAction: GamePlayAction = new GamePlayAction({
          gameId: gameState.gameId,
          creatorId: Meteor.userId(),
          actionType: GamePlayActionType.DECK_TO_HAND,
          visibilityType: VisibilityType.ALL,
          toPlayerId: hand.userId
        });
        for (let i = 0; i < numberOfCards; i++) {
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

    GamePlayActions.pushActions(actions);

  }

  static deckToHand(gameState: IGamePlayState, visibilityType: VisibilityType, toPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: visibilityType,
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.DECK_TO_HAND,
      cards: [gameState.tableFaceDown.get(0)]
    });
    GamePlayActions.pushAction(action);
  }


  static showHand(gameState: IGamePlayState, fromPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.ALL,
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_TABLE,
      cards: GamePlayActions.getHandFromUserId(gameState.hands, fromPlayerId).cardsInHand
    });
    GamePlayActions.pushAction(action);

  }

  static cardToTable(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, visibilityType: VisibilityType, fromPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: visibilityType,
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_TABLE,
      cards: [new Card({suit: suit, rank: rank})]
    });
    GamePlayActions.pushAction(action);
  }


  static handToPile(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, fromPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_PILE,
      cards: [new Card({suit: suit, rank: rank})]
    });
    GamePlayActions.pushAction(action);
  }

  static pileToHand(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, toPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.PILE_TO_HAND,
      cards: [new Card({suit: suit, rank: rank})]
    });
    GamePlayActions.pushAction(action);
  }

  static sortHand(gameState: IGamePlayState, cards: Card[], toPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.HAND_SORT,
      cards: cards
    });
    GamePlayActions.pushAction(action);
  }

  static pileToDeck(gameState: IGamePlayState, cards: Card[]) {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      actionType: GamePlayActionType.PILE_TO_DECK,
      cards: cards
    });
    GamePlayActions.pushAction(action);
  }

  static handToDeck(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, fromPlayerId: string = Meteor.userId()) {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_DECK,
      cards: [new Card({suit: suit, rank: rank})]
    });
    GamePlayActions.pushAction(action);
  }

  static tableToHand(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, toPlayerId: string = Meteor.userId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: Meteor.userId(),
      visibilityType: VisibilityType.PLAYER,
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.TABLE_TO_HAND,
      cards: [new Card({suit: suit, rank: rank})]
    });
    GamePlayActions.pushAction(action);
  }


  static trickReady(gameState: IGamePlayState): boolean {
    for (let i = 0; i < gameState.hands.size; i++) {
      let hand: Hand = gameState.hands.get(i);
      if (hand.cardsFaceUp.length !== 1)
        return false;
    }
    return true;
  }

  static takeTrick(gameState: IGamePlayState, toPlayerId: string = Meteor.userId()): void {
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
    GamePlayActions.pushAction(action);

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
      case GamePlayActionType.NEW_GAME:
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
      let action: GamePlayAction = (
      gameState.actions.findLastEntry((actionBeingExamined: GamePlayAction)=> {
        return GamePlayActions.isUndoable(gameState, actionBeingExamined);
      }) || [undefined, undefined])[1];
      if (!action)
        return action;
      let relatedActionId = action.relatedActionId;
      if (relatedActionId) {  // Make sure parent action is the one being undone
        return gameState.actions.get(relatedActionId);
      }
      return action;
    }
  }

  static undo(gameState: IGamePlayState, actionId: string) {
    GamePlayActions.pushAction(
      new GamePlayAction({
        actionType: GamePlayActionType.UNDO,
        gameId: gameState.gameId,
        creatorId: Meteor.userId(),
        relatedActionId: actionId
      })
    );
  }

  static error(error) {
    ReduxModuleCombiner.ngRedux.dispatch(
      ReduxModuleUtil.errorFactory(GamePlayActions.GAME_PLAY_ERROR, {error: error.error})
    );
  }
}
