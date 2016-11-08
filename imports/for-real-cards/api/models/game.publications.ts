import { Meteor } from 'meteor/meteor';
import * as log from 'loglevel';

import { HandCollection, Hand } from './hand.model.ts';
import { GamePlayActionCollection } from "./action.model.ts";
import {AccountsAdminTools} from "../../../common-app-api/src/api/services/accounts-admin-tools";

export interface GameSubscriptionOptions {
  gameId:string
}

export const GAME_SUBSCRIPTION_NAME = "frc.game-data";

if (Meteor.isServer) {
  Meteor.publish(GAME_SUBSCRIPTION_NAME, function (options:GameSubscriptionOptions) {
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
      let user:Meteor.User = Meteor.users.find({_id: this.userId});
      if (!AccountsAdminTools.isAdmin(user))
        return this.ready(); // Game only visible to its players or admins
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
    let actionCursor = GamePlayActionCollection.find({gameId: options.gameId});
//    log.debug("publish gameinfo: " + ", GameId:" + options.gameId +  ", userCount: " + userCursor.count(), ", hands count: " + handsCursor.count(), " action count:" + actionCursor.count())
    return [
      userCursor,
      handsCursor,
      actionCursor
    ];
  });
}