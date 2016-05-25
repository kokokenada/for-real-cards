/**
 * Created by kenono on 2016-04-23.
 */
import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';

import { HandCollection, Hand } from './hand.model.ts';
import { ActionCollection } from "./action.model.ts";

export interface GameSubscriptionOptions {
  gameId:string
}

export const GAME_SUBSCRPTION_NAME = "fastcards.game-data";

if (Meteor.isServer) {
  Meteor.publish(GAME_SUBSCRPTION_NAME, function (options:GameSubscriptionOptions) {
    if (!this.userId) {
      log.warn('Subscription denied due to no userId');
      return this.ready(); // Must be logged in
    }
    let gameUserIds:string[] = [];
    let handsCursor = HandCollection.find({gameId: options.gameId});
    handsCursor.forEach((game:Hand)=> {
      gameUserIds.push(game.userId);
    });
    if (gameUserIds.indexOf(this.userId)===-1) {
      return this.ready(); // Game only visisble to its players
    }
    let userCursor =  Meteor.users.find(
      {_id: {$in: gameUserIds}},
      {
        fields: {
          username: true,
          profile: true,
          emails: true
        }
      }
    );
    let actionCursor = ActionCollection.find({gameId: options.gameId});
    log.debug("publish gameinfo: " + ", GameId:" + options.gameId +  ", userCount: " + userCursor.count(), ", hands count: " + handsCursor.count(), " action count:" + actionCursor.count())
    return [
      userCursor,
      handsCursor,
      actionCursor
    ];
  });
}