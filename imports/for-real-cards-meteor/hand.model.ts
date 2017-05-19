import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import 'meteor/aldeed:simple-schema';

import { Card, Hand} from '../for-real-cards-lib';

export let HandCollection = new Mongo.Collection("hands");


let HandSchema = new SimpleSchema({
  gameId: {
    type: String,
  },
  userId: {
    type: String,
    optional: true
  },
  position: {
    type: Number
  },
  dateCreated: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    },
    denyUpdate: true
  }
});

function unregisteredOrUser(userId, hand:Hand) {
  if (hand.userId) {
    return hand.userId === userId; // Only registered (logged in) creator may change
  }
  return true; // Wide open if user not registered    
}

HandCollection.allow({
  insert: function (userId, hand:Hand) {  
    return false; // Use a method
  },
  update: function (userId, hand:Hand) {
    return unregisteredOrUser(userId, hand);
  },
  remove: function (userId, hand:Hand) {
    return unregisteredOrUser(userId, hand);
  } 
});

HandCollection.attachSchema(HandSchema);
 

