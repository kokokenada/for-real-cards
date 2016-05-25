
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';

import { getNextSequence } from '../../../common-app/api';

import { Game, GameCollection } from './game.model.ts';
import { HandCollection, Hand } from './hand.model.ts';
import { ActionCollection, Action, ActionType } from "./action.model";

if (Meteor.isServer) {
  Meteor.methods({
    /**
     * Creates a new game
     */
    FastCardsNewGame: function (password:string) {
      let id: string = getNextSequence('game').toString();
      GameCollection.insert({_id: id, creatorId: this.userId});
      return id;
    },
    /**
     * Adds a new player to a game, returns a Hand
     */
    FastCardsJoinGame: function (gameId:string, password:string) {
      let game:Game = GameCollection.findOne({_id: gameId});
      if (!game) {
        throw new Meteor.Error('gameId-not-found', 'The game Id "' + gameId + '" was not found.');
      }
      if (game.password) {
        if (game.password!==password) {
          throw new Meteor.Error('incorrect-password', 'The password "' + password + '" does not match the password for the game.');
        }
      }
      let existingHand:Hand = HandCollection.findOne({gameId: gameId, userId: this.userId});
      if (!existingHand) {  // See if joining user already has a hand
        let position:number = HandCollection.find({gameId: gameId}).count();
        log.debug('adding hand. userID: '+ this.userId + ", gameId:" + gameId  + ", pos:" + position);
        let handId:string = HandCollection.insert({gameId: game._id, position: position, userId: this.userId});

        // Add an action too
        let action:Action = new Action({
          gameId: gameId,
          creatorId: this.userId,
          actionType: ActionType.NEW_HAND
        });
        ActionCollection.insert(action);

        return HandCollection.findOne({_id: handId});
      }
      return existingHand;
    }
  });
}