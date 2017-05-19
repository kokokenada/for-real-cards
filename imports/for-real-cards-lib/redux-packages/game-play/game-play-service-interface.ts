import {IGamePlayActionPayload} from './game-play-payload-interface';

export interface IGamePlayService {
  actionPush(action: IGamePlayActionPayload): Promise<boolean>;
  actionArrayPush(actions: IGamePlayActionPayload[]): Promise<boolean>;
  watchGamePlayActionsAndHand(gameId: string): void;
}
