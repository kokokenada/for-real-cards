/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import {TypedRecord} from 'typed-immutable-record';
import {Hand, HandInterface} from "../../../api/models/hand.model";
import {Card} from "../../../api/models/card.model";
import {GamePlayAction, GamePlayActionInterface} from "../../../api/models/action.model";
import {GameConfig} from "../../../api/models/game-config";
import { List, OrderedMap } from "immutable";
import {IAppState} from "../../../../common-app/src/ui/redux/state.interface";


export interface IGamePlayState extends IAppState {
  gameId:string;
  lastNotified:Date;
  hands:List<Hand>;
  tableFaceDown:List<Card>;
  tablePile:List<Card>;
  actions:OrderedMap<string, GamePlayAction>;
  currentGameConfig: GameConfig;
  undoneIds:List<string>;
  idCounter: number;
}

export interface IGamePlayRecord extends TypedRecord<IGamePlayRecord>, IGamePlayState {}

export interface IGamePlayActionPayload {
  gamePlayAction?: GamePlayActionInterface;
  gamePlayActions?: GamePlayActionInterface[];
  newHand?:HandInterface;
  gameId?:string;
}
