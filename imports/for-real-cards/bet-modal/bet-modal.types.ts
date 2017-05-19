
import {IGamePlayState} from '../../for-real-cards-lib';
export interface IBetModalParams {
  gameState: IGamePlayState
}

export interface IBetModalResult {
  didBet: boolean;
  value: number;
}