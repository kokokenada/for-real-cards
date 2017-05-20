import { IException } from 'common-app';

export interface IGameStartService {
  newGame(password: string): Promise<string>;
  joinGame(gameId: string, password: string): Promise <boolean>;
  loadGame(gameId: string, password: string): Promise <boolean>;
}