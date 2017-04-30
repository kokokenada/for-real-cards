import {IAppState} from 'redux-package';

export interface IForRealCardsState extends IAppState {
  gameDescription:string;
  gameId:string;
  loading:boolean;
}

export interface IForRealCardsActionPayload {
  password?:string
  gameId?:string
}
