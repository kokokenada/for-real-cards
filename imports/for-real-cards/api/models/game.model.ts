import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {GameConfig} from "./game-config";

export let GameCollection = new Mongo.Collection("games");

export class Game {
  _id: string;
  dateCreated: Date;
  createorId: string;
  password: string;
}
 
let GamesSchema = new SimpleSchema({
    dateCreated: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        },
        denyUpdate: true
    },
    creatorId: {
        type: String,
        optional: true
    },
    password: {
      type: String,
      optional: true
    }
});

function unregisteredOrCreator(userId, game) {
  if (game.creatorId) {
    return game.creatorId === userId; // Only registered (logged in) creator may change
  }
  return true; // Wide open if, creator not registered    
}

GameCollection.allow({
  insert: function (userId, game) {
    return false; // Use metthod
  },
  update: function (userId, game) {
    return unregisteredOrCreator(userId, game);
  },
  remove: function (userId, game) {
    return unregisteredOrCreator(userId, game);
  } 
});

if (Meteor.isServer) {
  Meteor.publish('games'), function() {
    return GameCollection.find({});
  }
}

GameCollection.attachSchema(GamesSchema);
 

