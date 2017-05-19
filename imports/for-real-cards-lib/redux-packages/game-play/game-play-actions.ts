import {List} from "immutable";

import { Card, CardSuit, CardRank, DealSequence, DealLocation, Deck, GameConfig, GamePlayActionType, GamePlayAction, Hand, HandInterface, VisibilityType } from "./index";
import { IGamePlayState } from "./game-play-state";
import {IException, ReduxModuleUtil} from 'common-app';
import {ReduxPackageCombiner} from "redux-package";
import {GamePlayFunctions} from './game-play.functions';

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
  
  private static _currentUserId:string;
  static setCurrentUserID(id: string) {
    GamePlayActions._currentUserId = id;
  }
  private static getCurrentUserId(): string {
    if (GamePlayActions._currentUserId === undefined)
      throw 'call GamePlayActions.setCurrentUserID first';
    return GamePlayActions._currentUserId;
  }

  /**
   * Sets game Id and kicks off watching for data changes
   * @param gameId
   */
  static initialize(gameId: string): void {
    let newGameAction: GamePlayAction = new GamePlayAction({
      gameId: gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      actionType: GamePlayActionType.NEW_GAME
    });
    ReduxPackageCombiner.dispatch({type: GamePlayActions.GAME_PLAY_INITIALIZE, payload: {gameId}});
    this.receiveAction(newGameAction);
  }

  /**
   * Writes an action to the database
   * @param action
   */
  private static pushAction(action: GamePlayAction): void {
    ReduxPackageCombiner.dispatch({type: GamePlayActions.GAME_PLAY_ACTION_PUSH, payload: {gamePlayAction: action}});
  }

  /**
   * Writes an array of actions to the database
   * @param actions
   */
  private static pushActions(actions: GamePlayAction[]): void {
    ReduxPackageCombiner.dispatch({type: GamePlayActions.GAME_PLAY_ACTIONSSS_PUSH, payload: {gamePlayActions: actions}});
  }

  /**
   * Processes an action locally
   * @param action
   */
  static receiveAction(action: GamePlayAction) {
    ReduxPackageCombiner.dispatch({type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED, payload: {gamePlayAction: action}});
  }

  /**
   * Processes an actions locally
   * @param actions
   */
  static receiveActions(actions: GamePlayAction[]) {
    ReduxPackageCombiner.dispatch({type: GamePlayActions.GAME_PLAY_ACTIONSSS_RECIEVED, payload: {gamePlayActions: actions}});
  }

  static newHand(gameId: string, hand: HandInterface) {
    ReduxPackageCombiner.dispatch(
      {
        type: GamePlayActions.GAME_PLAY_ACTION_RECIEVED,
        payload: {
          gamePlayAction: {
            _id: 'newhand:' + hand._id, // Ensure gamePlayAction has unique ID to prevent double processing
            gameId: gameId,
            creatorId: GamePlayActions.getCurrentUserId(),
            toPlayerId: hand.userId,
            actionType: GamePlayActionType.NEW_HAND
          },
          newHand: hand
        }
      }
    );
  }

  static nextStep(gameState: IGamePlayState) {
    GamePlayActions.pushAction(
      new GamePlayAction({
        gameId: gameState.gameId,
        creatorId: GamePlayActions.getCurrentUserId(),
        actionType: GamePlayActionType.DEAL_STEP
      })
    );
  }

  static deal(gameState: IGamePlayState, gameConfig: GameConfig, numberOfCardsRequested: number) {

    GamePlayActions.pushAction(new GamePlayAction({  // Push RESET separately because it is a different undo block
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      actionType: GamePlayActionType.RESET
    }));

    let actions: GamePlayAction[] = [];
    let initializeAction: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      actionType: GamePlayActionType.DEAL,
      gameConfig: gameConfig
    });

    // Add cards to table
    let deck: Deck = gameConfig.deck;
    if (!deck) {
      console.error('Expected deck to be defined in gameConfig in DEAL action type');
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
      let dealSequence:DealSequence = gameConfig.dealSequence[0];
      let numberOfCards:number;
      if (GameConfig.dealerCanSelectNumberOfCards(dealSequence)) {
        numberOfCards = numberOfCardsRequested;
        if ( !(numberOfCards > 0) ) {
          throw "Number of cards must be >0";
        }
      } else {
        numberOfCards = dealSequence.minimumNumberOfCards;
      }
      if (dealSequence.dealLocation===DealLocation.HAND_HIDDEN) {
        let toPlayerAction: GamePlayAction = new GamePlayAction({
          gameId: gameState.gameId,
          creatorId: GamePlayActions.getCurrentUserId(),
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
          creatorId: GamePlayActions.getCurrentUserId(),
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
        creatorId: GamePlayActions.getCurrentUserId(),
        actionType: GamePlayActionType.DECK_TO_PILE
      }));
    }

    GamePlayActions.pushActions(actions);

  }

  static deckToHand(gameState: IGamePlayState, visibilityType: VisibilityType, toPlayerId: string = GamePlayActions.getCurrentUserId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      visibilityType: visibilityType,
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.DECK_TO_HAND,
      cards: [gameState.tableFaceDown.get(0)]
    });
    GamePlayActions.pushAction(action);
  }


  static showHand(gameState: IGamePlayState, fromPlayerId: string = GamePlayActions.getCurrentUserId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      visibilityType: VisibilityType.ALL,
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_TABLE,
      cards: GamePlayActions.getHandFromUserId(gameState.hands, fromPlayerId).cardsInHand
    });
    GamePlayActions.pushAction(action);

  }

  static cardToTable(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, visibilityType: VisibilityType, fromPlayerId: string = GamePlayActions.getCurrentUserId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      visibilityType: visibilityType,
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_TABLE,
      cards: [new Card({suit: suit, rank: rank})]
    });
    GamePlayActions.pushAction(action);
  }


  static handToPile(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, fromPlayerId: string = GamePlayActions.getCurrentUserId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      visibilityType: VisibilityType.PLAYER,
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_PILE,
      cards: [new Card({suit: suit, rank: rank})]
    });
    GamePlayActions.pushAction(action);
  }

  static pileToHand(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, toPlayerId: string = GamePlayActions.getCurrentUserId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      visibilityType: VisibilityType.PLAYER,
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.PILE_TO_HAND,
      cards: [new Card({suit: suit, rank: rank})]
    });
    GamePlayActions.pushAction(action);
  }

  static sortHand(gameState: IGamePlayState, cards: Card[], toPlayerId: string = GamePlayActions.getCurrentUserId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.HAND_SORT,
      cards: cards
    });
    GamePlayActions.pushAction(action);
  }

  static pileToDeck(gameState: IGamePlayState, cards: Card[]) {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      visibilityType: VisibilityType.PLAYER,
      actionType: GamePlayActionType.PILE_TO_DECK,
      cards: cards
    });
    GamePlayActions.pushAction(action);
  }

  static handToDeck(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, fromPlayerId: string = GamePlayActions.getCurrentUserId()) {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      fromPlayerId: fromPlayerId,
      actionType: GamePlayActionType.HAND_TO_DECK,
      cards: [new Card({suit: suit, rank: rank})]
    });
    GamePlayActions.pushAction(action);
  }

  static tableToHand(gameState: IGamePlayState, suit: CardSuit, rank: CardRank, toPlayerId: string = GamePlayActions.getCurrentUserId()): void {
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
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

  static takeTrick(gameState: IGamePlayState, toPlayerId: string = GamePlayActions.getCurrentUserId()): void {
    if (!GamePlayActions.trickReady(gameState))
      throw {code: 'all-users-must-have-1-card-on-table', message: "All the users must have 1 card on the table for you to take thr trick"};
    let trick: Card[] = [];
    gameState.hands.forEach((hand: Hand)=> {
      trick.push(hand.cardsFaceUp[0]);
    });
    let action: GamePlayAction = new GamePlayAction({
      gameId: gameState.gameId,
      creatorId: GamePlayActions.getCurrentUserId(),
      toPlayerId: toPlayerId,
      actionType: GamePlayActionType.TAKE_TRICK,
      cards: trick
    });
    GamePlayActions.pushAction(action);

  }

  static getHandFromUserId(hands: List<Hand>, userId: string): Hand {
    return hands.find((hand: Hand)=> hand.userId === userId);
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
        return !GamePlayFunctions.isUndone(state, action); // Don't undo twice
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
    return null;
  }

  static undo(gameState: IGamePlayState, actionId: string) {
    GamePlayActions.pushAction(
      new GamePlayAction({
        actionType: GamePlayActionType.UNDO,
        gameId: gameState.gameId,
        creatorId: GamePlayActions.getCurrentUserId(),
        relatedActionId: actionId
      })
    );
  }

  static error(error) {
    ReduxPackageCombiner.dispatch(
      ReduxModuleUtil.errorFactory(GamePlayActions.GAME_PLAY_ERROR, {error: error.error})
    );
  }

  static bet(gameState: IGamePlayState, moneyAmount: number, playerId: string = GamePlayActions.getCurrentUserId()) {
    GamePlayActions.pushAction(new GamePlayAction({
      actionType: GamePlayActionType.BET,
      gameId: gameState.gameId,
      toPlayerId: playerId,
      creatorId: GamePlayActions.getCurrentUserId(),
      moneyAmount
    }));
  }

  static buy(gameState: IGamePlayState, moneyAmount: number, playerId: string = GamePlayActions.getCurrentUserId()) {
    GamePlayActions.pushAction(new GamePlayAction({
      actionType: GamePlayActionType.BUY,
      gameId: gameState.gameId,
      toPlayerId: playerId,
      creatorId: GamePlayActions.getCurrentUserId(),
      moneyAmount
    }));
  }

  static fold(gameState: IGamePlayState, playerId: string = GamePlayActions.getCurrentUserId()) {
    GamePlayActions.pushAction(new GamePlayAction({
      actionType: GamePlayActionType.FOLD,
      gameId: gameState.gameId,
      toPlayerId: playerId,
      creatorId: GamePlayActions.getCurrentUserId(),
    }));
  }
}
