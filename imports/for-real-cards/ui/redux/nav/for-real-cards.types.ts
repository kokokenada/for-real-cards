import {IAppState} from "../../../../common-app/src/ui/redux/state.interface";

export interface IForRealCardsState extends IAppState {
  gameDescription:string;
  gameId:string;
  loading:boolean;
}

export interface IForRealCardsActionPayload {
  password?:string
  gameId?:string
}
