import { IException } from 'common-app';

export interface IGameStartService {
  newGame(password: string): Promise<string | IException>;
  joinGame(gameId: string, password: string): Promise <boolean | IException >;
  loadGame(gameId: string, password: string): Promise <boolean | IException >;
}