import { GameConfig, IGamePlayState } from '../../for-real-cards-lib';

export interface DealModalParam {
  gameState:IGamePlayState;
}

export interface DealModalResult {
  nextStep: boolean;
  gameConfig?: GameConfig;
  numberOfCards?: number;
}

