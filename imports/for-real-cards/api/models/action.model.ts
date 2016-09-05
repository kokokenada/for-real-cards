/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';

import { HandCollection } from '../models/hand.model';
import {Card} from './card.model'
import {GameConfig} from './game-config';


export let GamePlayActionCollection = new Mongo.Collection("actions", {transform: decode});

export enum GamePlayActionType {
  SET_GAME_ID,        // 0
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
  UNDO
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
//  sequenceLength:number;
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
    relatedActionId?:string
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
  }
}

let UserCommmandSchema = new SimpleSchema({
  from: {
    type:Number
  },
  to: {
    type:Number
  },
  cardCountAllowed: {
    type: Number
  }
});

let GameConfigSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  minimumNumberOfPlayers: {
    type: Number
  },
  maximumNumberOfPlayers: {
    type: Number
  },
  _deck_id: {
    type:Number
  },
  numberOfCardsToPlayer: {
    type: Number
  },
  deckLocationAfterDeal: {
    type: Number
  },
  hasTricks: {
    type: Boolean
  },
  userCommands: {
    type:Array
  },
  "userCommands.$": {
    type: UserCommmandSchema
  }, 
  turnCardUpAfterDeal: {
    type: Boolean,
    optional: true
  },
  numberOfCardsToPlayerFaceUp: {
    type: Number,
    optional: true
  }
});

let GamePlayActionSchema = new SimpleSchema({
  gameId: {
    type: String
  },
  creatorId: {
    type: String
  },
  dateCreated: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    },
    denyUpdate: true
  },
  actionType: {
    type: Number
  },
  toPlayerId: {
    type: String,
    optional: true
  },
  fromPlayerId: {
    type: String,
    optional: true
  },
  visibilityType: {
    type: Number,
    optional: true
  },
  cardsEncoded: {
    type: String,
    optional: true
  },
  gameConfig: {
    type: GameConfigSchema,
    optional: true
  },
  relatedActionId: {
    type: String,
    optional: true
  }
});


GamePlayActionCollection.allow({
  insert: function (userId, action:GamePlayAction) {
    return false; // Use method
  },
  update: function (userId, game) {
    return false; // Use method
  },
  remove: function (userId, game) {
    return false; // Use method
  }
});

function encodeCards(cards:Card[]):string {
  let returnValue:string = '';
  cards.forEach((card:Card)=>{
    if (!card) {
      log.error(cards);
      console.trace();
      throw new Meteor.Error('internal-error', 'Card in action is empty');
    }
    returnValue += new Card({rank: card.rank, suit: card.suit}).encode();
  });
  return returnValue;
}

function decode(action:GamePlayAction):GamePlayAction {
  action.cards = [];
  let cardsEncoded:string = action.cardsEncoded;
  if (cardsEncoded) {
    for (let i = 0; i < cardsEncoded.length; i = i + 2) {
      let cardCode = cardsEncoded.substr(i, 2);
      let card:Card = new Card({code: cardCode});
      action.cards.push(card);
    }
  }
  if (action.gameConfig) {
    action.gameConfig = new GameConfig(action.gameConfig);
  }
  return action;
}

function checkUser(gameId:string, userId:string) {
  let hand = HandCollection.findOne({gameId: gameId, userId: userId});
  if (!hand) {
    throw new Meteor.Error('user-hand-not-found', 'gameId "' + gameId + '" was not found for current user (' + userId + ')');
  }
}

function addAction(action:GamePlayAction, userId:string):string {
  if (action.creatorId !== userId)
    throw new Meteor.Error('invalid-user', 'current userId does not match user ID of passed object');
  checkUser(action.gameId, action.creatorId);
  action.cardsEncoded = encodeCards(action.cards);
  if (action.gameConfig) {
    action.gameConfig._deck_id = action.gameConfig.deck.id;
  }
  return GamePlayActionCollection.insert(action);
}

if (Meteor.isServer) {
  Meteor.methods(
    {
      'fastcards.NewAction': function(action:GamePlayAction) {
        addAction(action, this.userId);
      },
      'fastcards.NewActions': function(actions:GamePlayAction[]) {
        let action:GamePlayAction = actions[0];
        let groupId = addAction(action, this.userId);
        for (let i=1; i<actions.length; i++) {
          action = actions[i];
          action.relatedActionId = groupId;
          addAction(action, this.userId);
        }
      }
    }
  );
}

GamePlayActionCollection.attachSchema(GamePlayActionSchema);


