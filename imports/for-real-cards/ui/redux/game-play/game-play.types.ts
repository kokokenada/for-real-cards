import {TypedRecord} from 'typed-immutable-record';
import {IAppState} from "../../../../common-app";


export interface IGamePlayState extends IAppState {

}

export interface IGamePlayRecord extends TypedRecord<IGamePlayRecord>, IGamePlayState {}

export interface IGamePlayActionPayload {

}
