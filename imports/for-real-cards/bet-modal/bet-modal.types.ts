
import {IGamePlayState} from '../ui/redux/game-play/game-play.types';
export interface IBetModalParams {
  gameState: IGamePlayState
}

export interface IBetModalResult {
  didBet: boolean;
  value: number;
}