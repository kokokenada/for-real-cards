/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';

import { getNextSequence } from '/imports/common-app-api';

import { Game, GameCollection } from './game.model.ts';
import { HandCollection, Hand } from './hand.model.ts';
import { ActionCollection, Action, ActionType } from "./action.model";

function joinGamegameId(gameId:string, userId:string, password:string):Hand {
  let game:Game = <Game>GameCollection.findOne({_id: gameId});
  if (!game) {
    throw new Meteor.Error('gameId-not-found', 'The game Id "' + gameId + '" was not found.');
  }
  if (game.password) {
    if (game.password !== password) {
      throw new Meteor.Error('incorrect-password', 'The password "' + password + '" does not match the password for the game.');
    }
  }
  let existingHand:Hand = <Hand>HandCollection.findOne({gameId: gameId, userId: userId});
  if (!existingHand) {  // See if joining user already has a hand
    let position:number = HandCollection.find({gameId: gameId}).count();
    log.debug('adding hand. userID: ' + userId + ", gameId:" + gameId + ", pos:" + position);
    let handId:string = HandCollection.insert({gameId: game._id, position: position, userId: userId});

    // Add an action too
    let action:Action = new Action({
      gameId: gameId,
      creatorId: userId,
      actionType: ActionType.NEW_HAND
    });
    ActionCollection.insert(action);

    return HandCollection.findOne({_id: handId});
  }
  return existingHand;

}

if (Meteor.isServer) {

  Meteor.methods({
    /**
     * Creates a new game
     */
    ForRealCardsNewGame: function (password:string):string {
      let id:string = getNextSequence('game').toString();
      GameCollection.insert({_id: id, creatorId: this.userId});
      joinGamegameId(id, this.userId, password);
      return id;
    },
    /**
     * Adds a new player to a game, returns a Hand
     */
    ForRealCardsJoinGame: function (gameId:string, password:string):Hand {
      return joinGamegameId(gameId, this.userId, password);
    }
  });
}
export let something=""