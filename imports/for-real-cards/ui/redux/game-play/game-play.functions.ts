import {List} from "immutable";
import {Hand} from "../../../api/";
import {IGamePlayState} from './game-play.types';
import {GamePlayAction, GamePlayActionType} from '../../../api/models/action.model';
import {DealSequence} from '../../../api/models/game-config';

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
      if (action.actionType === GamePlayActionType.BET && action.creatorId === playerId) {
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
    GamePlayFunctions.forEachActionInCurrentGame(gameState, (action:GamePlayAction) => {
      if (action.actionType === GamePlayActionType.BUY && action.creatorId === playerId) {
        result += action.moneyAmount;
      }
      if (action.actionType === GamePlayActionType.BET && action.creatorId === playerId) {
        result -= action.moneyAmount;
      }
      if (action.actionType === GamePlayActionType.TAKE_MONEY && action.creatorId === playerId) {
        result += action.moneyAmount;
      }
    });
    return result;
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