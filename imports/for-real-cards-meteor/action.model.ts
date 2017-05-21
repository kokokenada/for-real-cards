import 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { HandCollection } from './hand.model';
import { Card, IGamePlayState, GameConfig, GamePlayAction } from '../for-real-cards-lib'
import {CardEncoder} from '../for-real-cards-lib/redux-packages/game-play/card-encoder';


export let GamePlayActionCollection = new Mongo.Collection("actions");

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

let GameDealSequence = new SimpleSchema({
  dealLocation: {
    type: Number
  },
  minimumNumberOfCards: {
    type: Number
  },
  maximumNumberOfCards: {
    type: Number
  },
  description: {
    type: String,
    optional: true
  }
});

let GameConfigSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  minimumNumberOfPlayers: {
    type: Number,
    optional: true // it is in fact, required. But SimpleSchema was bitching for no good reason (when gameConfig was null)
  },
  maximumNumberOfPlayers: {
    type: Number,
    optional: true // it is in fact, required. But SimpleSchema was bitching for no good reason (when gameConfig was null)
  },
  _deck_id: {
    type:Number,
    optional: true // it is in fact, required. But SimpleSchema was bitching for no good reason (when gameConfig was null)
  },
  dealSequence: {
    type:Array,
    optional: true // it is in fact, required. But SimpleSchema was bitching for no good reason (when gameConfig was null)
  },
  "dealSequence.$": {
    type: GameDealSequence
  },
  deckLocationAfterDeal: {
    type: Number,
    optional: true // it is in fact, required. But SimpleSchema was bitching for no good reason (when gameConfig was null)
  },
  hasTricks: {
    type: Boolean,
    optional: true // it is in fact, required. But SimpleSchema was bitching for no good reason (when gameConfig was null)
  },
  hasBets: {
    type: Boolean,
    optional: true // it is in fact, required. But SimpleSchema was bitching for no good reason (when gameConfig was null)
  },
  userCommands: {
    type:Array,
    optional: true // it is in fact, required. But SimpleSchema was bitching for no good reason (when gameConfig was null)
  },
  "userCommands.$": {
    type: UserCommmandSchema
  }, 
  turnCardUpAfterDeal: {
    type: Boolean,
    optional: true
  },
  alwaysShowTurnedUpCard: {
    type: Boolean,
    defaultValue: false
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
  },
  moneyAmount: {
    type: Number,
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

function checkUser(gameId:string, userId:string) {
  let hand = HandCollection.findOne({gameId: gameId, userId: userId});
  if (!hand) {
    const message = 'gameId "' + gameId + '" was not found for current user ' + userId + "'";
    console.log(message);
    throw new Meteor.Error('user-hand-not-found', message);
  }
}

function addAction(action:GamePlayAction, userId:string):string {
  if (action.creatorId !== userId)
    throw new Meteor.Error('invalid-user', 'current userId does not match user ID of passed object');
  checkUser(action.gameId, action.creatorId);
  action.cardsEncoded = CardEncoder.encodeCards(action.cards);
  if (action.gameConfig) {
    action.gameConfig._deck_id = action.gameConfig.deck.id;
  } else {
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


