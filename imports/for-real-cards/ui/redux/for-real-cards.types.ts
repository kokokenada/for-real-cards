import {TypedRecord} from 'typed-immutable-record';
import {IAppState} from "../../../common-app/";

import {TopFrame} from "../../top-frame/top-frame.base";

export interface IForRealCardsState extends IAppState {
  topFrame: TopFrame
}

export interface IForRealCardsRecord extends TypedRecord<IForRealCardsRecord>, IForRealCardsState {}

export interface IForRealCardsAction {
  topFrame: TopFrame
}
