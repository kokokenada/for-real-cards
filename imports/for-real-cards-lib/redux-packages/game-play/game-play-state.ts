import {Hand, HandInterface} from './hand.class';
import {Card} from './card.class';
import {GamePlayAction, GamePlayActionInterface} from "./action.class";
import {GameConfig} from './game-config.class';
import { List, OrderedMap } from "immutable";
import { IAppState } from 'redux-package';


export interface IGamePlayState extends IAppState {
  gameId:string;
  hands:List<Hand>;
  tableFaceDown:List<Card>;
  tablePile:List<Card>;
  actions:OrderedMap<string, GamePlayAction>;
  currentGameConfig: GameConfig;
  undoneIds:List<string>;
  idCounter: number;
}

