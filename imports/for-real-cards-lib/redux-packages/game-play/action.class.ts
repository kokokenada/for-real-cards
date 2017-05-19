import {Card} from './card.class'
import {GameConfig} from './game-config.class';
import {IGamePlayState} from './game-play-state';

export enum GamePlayActionType {
  NEW_GAME,        // 0
  RESET,              // 1
  NEW_HAND,           // 2
  DEAL,               // 3
  DECK_TO_HAND,       // 4
  HAND_TO_TABLE,      // 5
  DECK_TO_PILE,       // 6
  HAND_TO_PILE,       // 7
  HAND_SORT,          // 8
  PILE_TO_HAND,       // 9
  PILE_TO_DECK,       // 10
  HAND_TO_DECK,       // 11
  TABLE_TO_HAND,      // 12
  TAKE_TRICK,         // 13
  DEAL_STEP,          // 14 - A step in the deal sequence
  UNDO,               // 15
  BET,                // 16
  FOLD,               // 17
  BUY,                // 18
  TAKE_MONEY          // 19
}

export enum VisibilityType {
  NO_ONE,
  ALL,
  PLAYER
}

class GamePlayActionData {
  constructor() {}
  _id:string;
  gameId:string;
  creatorId:string;
  dateCreated:Date;
  actionType:GamePlayActionType;
  toPlayerId:string;
  fromPlayerId:string;
  visibilityType:VisibilityType;
  cards:Card[];
  cardsEncoded: string; // Persistence string for cards:Card[]
  gameConfig: GameConfig;
  relatedActionId: string;
  sequencePosition:number;
  moneyAmount: number;
  previousState:IGamePlayState; // A memory leak ??? , but handy for now
}

export interface GamePlayActionInterface extends GamePlayActionData {

}

export class GamePlayAction extends GamePlayActionData {
  constructor(initialValues:{
    _id?:string,
    gameId:string, 
    creatorId:string,
    dateCreated?:Date,
    actionType:GamePlayActionType,
    toPlayerId?:string,
    fromPlayerId?:string,
    visibilityType?:VisibilityType,
    cards?:Card[],
    gameConfig?:GameConfig,
    relatedActionId?:string,
    moneyAmount?:number
    }) 
  {
    super();
    this._id = initialValues._id
    this.gameId = initialValues.gameId;
    this.creatorId = initialValues.creatorId;
    this.dateCreated = initialValues.dateCreated;
    this.actionType = initialValues.actionType;
    this.toPlayerId = initialValues.toPlayerId;
    this.fromPlayerId = initialValues.fromPlayerId;
    this.visibilityType = initialValues.visibilityType;
    this.cards = initialValues.cards || [];
    this.gameConfig = initialValues.gameConfig;
    this.relatedActionId = initialValues.relatedActionId;
    this.moneyAmount = initialValues.moneyAmount;
  }
}
