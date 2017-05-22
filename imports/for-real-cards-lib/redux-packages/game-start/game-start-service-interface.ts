import {IDocumentChange, IUser} from 'common-app';
import {Observable} from 'rxjs/Observable';

export interface IGameStartService {
  newGame(password: string): Promise<string>;
  joinGame(gameId: string, password: string): Promise <boolean>;
  loadGame(gameId: string, password: string): Promise <boolean>;
  watchRelatedUsers(gameId: string): Promise<Observable<IDocumentChange<IUser>>>;
}