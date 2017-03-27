
import {List} from "immutable";
import {Hand} from "../../../api/";

export class GamePlayFunctions {
  static getHandIndexFromUserId(hands: List<Hand>, userId: string): number {
  return hands.findIndex((hand: Hand)=> {
    return hand.userId === userId
  });
}

}