import {GameConfig} from "../api/models/game-config";
import {IGamePlayState} from '../ui/redux/game-play/game-play.types';

export interface DealModalParam {
  gameState:IGamePlayState;
}

export interface DealModalResult {
  nextStep: boolean;
  gameConfig?: GameConfig;
  numberOfCards?: number;
}

