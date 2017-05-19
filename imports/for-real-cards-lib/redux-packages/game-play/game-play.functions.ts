import { List } from 'immutable';
import { Hand } from './hand.class';
import {IGamePlayState} from './game-play-state';
import {GamePlayAction, GamePlayActionType} from './action.class';
import {DealSequence, GameConfig} from './game-config.class';

export class GamePlayFunctions {
  static getHandIndexFromUserId(hands: List<Hand>, userId: string): number {
    return hands.findIndex((hand: Hand) => {
      return hand.userId === userId
    });
  }

  static isMidDealSequence(gameState: IGamePlayState ) : boolean {
    if (gameState.currentGameConfig.dealSequence.length === 1) {
      return false;
    }
    const step = GamePlayFunctions.currentStepIndex(gameState);
    return (step<gameState.currentGameConfig.dealSequence.length - 1);
  }

  static currentStepIndex(gameState: IGamePlayState) : number {
    if (gameState.currentGameConfig.dealSequence.length === 1) {
      return 0;
    }
    let index = 0;
    gameState.actions.forEach( (action:GamePlayAction) => {
      switch (action.actionType) {
        case GamePlayActionType.DEAL:
          index = 0;
          break;
        case GamePlayActionType.DEAL_STEP:
          index++;
      }
    });
    return index;
  }


  static isUndone(state: IGamePlayState, action: GamePlayAction): boolean {
    return state.undoneIds.indexOf(action._id) !== -1;
  }

  /**
   * Iterates through actions of current plays since deal ignoring undo's
   * @param gameState
   * @param callback
   */
  static forEachActionInCurrentDeal(gameState: IGamePlayState, callback: (action: GamePlayAction) => void) {
    let result: GamePlayAction[] = [];
    gameState.actions.forEach( (action:GamePlayAction) => {
      if (action.actionType === GamePlayActionType.DEAL) {
        result = [];
      }
      if (!GamePlayFunctions.isUndone(gameState, action))
        result.push(action);
    });
    result.forEach( (resultAction: GamePlayAction) => {
      callback(resultAction);
    })
  }

  /**
   * Iterates through actions of current plays since deal ignoring undo's
   * @param gameState
   * @param callback
   */
  static forEachActionInCurrentGame(gameState: IGamePlayState, callback: (action: GamePlayAction) => void) {
    let result: GamePlayAction[] = [];
    gameState.actions.forEach( (action:GamePlayAction) => {
      if (action.actionType === GamePlayActionType.DEAL) {
        result = [];
      }
      if (!GamePlayFunctions.isUndone(gameState, action))
        callback(action);
    });
  }

  static nextDealStepDescription(gameState: IGamePlayState) : string {
    const index = GamePlayFunctions.currentStepIndex(gameState);
    const dealSequence = gameState.currentGameConfig.dealSequence;
    if (index < dealSequence.length -1)
      return dealSequence[index + 1].description;
    return null;
  }

  static currentDealStep(gameState: IGamePlayState) : DealSequence {
    return gameState.currentGameConfig.dealSequence[GamePlayFunctions.currentStepIndex(gameState)];
  }

  static dealerCanSelectNumberOfCards(gameState: IGamePlayState): boolean {
    return GameConfig.dealerCanSelectNumberOfCards(GamePlayFunctions.currentDealStep(gameState));
  }

  static moneyOnTable(gameState: IGamePlayState, centerOnly: boolean) : number {
    let result = 0;
    let notInCenter = 0;
    GamePlayFunctions.forEachActionInCurrentDeal(gameState, (action:GamePlayAction) => {
      if (action.actionType === GamePlayActionType.BET) {
        result += action.moneyAmount;
        notInCenter = notInCenter  + action.moneyAmount;
      }
      if (action.actionType === GamePlayActionType.DEAL_STEP) {
        notInCenter = 0;
      }
    });
    if (centerOnly)
      return result - notInCenter;
    return result;
  }

  static moneyPlayerBetting(gameState: IGamePlayState, playerId: string) : number {
    let result = 0;
    GamePlayFunctions.forEachActionInCurrentDeal(gameState, (action:GamePlayAction) => {
      if (action.actionType === GamePlayActionType.BET && action.toPlayerId === playerId) {
        result += action.moneyAmount;
      }
      if (action.actionType === GamePlayActionType.DEAL_STEP) {
        result = 0;
      }
    });
    return result;
  }

  static moneyPlayerHas(gameState: IGamePlayState, playerId: string) : number {
    let result = 0;
    let hands = {};
    let currentBet = 0;
    GamePlayFunctions.forEachActionInCurrentGame(gameState, (action:GamePlayAction) => {
      if (action.actionType===GamePlayActionType.NEW_HAND) { // Add hands as they come in
        hands[action.toPlayerId]= {action};
      }
      if (action.actionType === GamePlayActionType.BUY && action.toPlayerId === playerId) {
        result += action.moneyAmount;
      }
      if (action.actionType === GamePlayActionType.BET && action.toPlayerId === playerId) {
        currentBet += action.moneyAmount;
        result -= action.moneyAmount;
      }
      if (action.actionType === GamePlayActionType.TAKE_MONEY && action.toPlayerId === playerId) {
        result += action.moneyAmount;
      }
      if (action.actionType === GamePlayActionType.FOLD) {
        // TRACK WHO HAS FOLDED
        hands[action.toPlayerId].folded = true;
      }
      // NEW ROUND
      if (action.actionType === GamePlayActionType.DEAL_STEP || action.actionType === GamePlayActionType.DEAL) {
        // If everybody except player has folded return bet to player
        let everyoneFolded = true;
        Object.keys(hands).forEach( (key)=>{
          if (!(hands[key].folded) && key !== playerId) {
            everyoneFolded = false;
          }
        });
        if (everyoneFolded) {
          result += currentBet;
        }
        currentBet = 0;
      }
    });
    return result;
  }

  static hasPlayerFolded(gameState: IGamePlayState, playerId: string) : boolean {
    let retVal = false;
    GamePlayFunctions.forEachActionInCurrentDeal(gameState, (action: GamePlayAction) => {
      if (action.actionType === GamePlayActionType.FOLD && action.toPlayerId === playerId)
        retVal = true;
    });
    return retVal;
  }

  static areBetsEven(gameState: IGamePlayState): boolean {
    let retVal = true;
    let bet: number = null;
    gameState.hands.forEach( (hand: Hand) => {
      if ( !GamePlayFunctions.hasPlayerFolded(gameState, hand.userId) ) {
        if (bet === null) {
          bet = GamePlayFunctions.moneyPlayerBetting(gameState, hand.userId);
        } else {
          if (bet !== GamePlayFunctions.moneyPlayerBetting(gameState, hand.userId)) {
            retVal = false;
          }
        }
      }
    } );
    return retVal;
  }

  static hasBets(gameState: IGamePlayState): boolean {
    let retVal = false;
    GamePlayFunctions.forEachActionInCurrentGame(gameState, (action:GamePlayAction) => {
      if (action.actionType === GamePlayActionType.TAKE_MONEY)
        retVal = true;
    });
    return retVal;
  }

}