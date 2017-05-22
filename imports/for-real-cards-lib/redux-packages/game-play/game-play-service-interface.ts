import {GamePlayActionInterface} from './action.class';
import {HandInterface} from './hand.class';
import {IDocumentChange } from 'common-app';
import {Observable} from 'rxjs/Observable';

export interface IGamePlayService {
  actionPush(action: GamePlayActionInterface): Promise<boolean>;
  actionArrayPush(actions: GamePlayActionInterface[]): Promise<boolean>;
  watchHands(gameId: string): Promise<Observable<IDocumentChange<HandInterface>>>;
  watchGameActions(gameId: string): Promise<Observable<IDocumentChange<HandInterface>>>;
  startSubscriptions(gameId);
}
