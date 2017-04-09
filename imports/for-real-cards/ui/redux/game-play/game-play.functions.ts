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

}