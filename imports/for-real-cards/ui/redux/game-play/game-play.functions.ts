import {List} from "immutable";
import {Hand} from "../../../api/";
import {IGamePlayState} from './game-play.types';

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
    return true; // To do, scan actions to find out if we're at the end of the deal sequence
  }

}