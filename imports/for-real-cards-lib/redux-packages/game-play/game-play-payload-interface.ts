
import {IGamePlayState} from './game-play-state';
import {TypedRecord} from 'typed-immutable-record';
import {GamePlayActionInterface} from './action.class';
import {HandInterface} from './hand.class';

export interface IGamePlayRecord extends TypedRecord<IGamePlayRecord>, IGamePlayState {}

export interface IGamePlayActionPayload {
  gamePlayAction?: GamePlayActionInterface;
  gamePlayActions?: GamePlayActionInterface[];
  newHand?:HandInterface;
  gameId?:string;
}
