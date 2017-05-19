import {IAppState} from 'redux-package';

export interface IGameStartState extends IAppState {
  gameDescription:string;
  gameId:string;
  loading:boolean;
}
