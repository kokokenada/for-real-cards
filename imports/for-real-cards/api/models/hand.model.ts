import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {Card} from './card.model'

export let HandCollection = new Mongo.Collection("hands");

const enum SortSequence {
  SUIT,
  RANK
}

export class Hand {
  _id: string;
  gameId: string;
  userId: string;
  position: number;
  dateCreated: Date;
  cardsFaceDown:Card[]; // not persisted
  cardsFaceUp:Card[]; // not persisted
  cardsInHand:Card[]; // not persisted
  tricks:Card[][] = [];  // Not persisted
  handSortSequence:SortSequence = SortSequence.RANK; // Not persisted
  
  constructor(hand:Hand) {
    _.extend(this, hand);
  }
  
  static indexOf(hands:Hand[], handIdToFind:string):number {
    for (let i = 0; i<hands.length; i++) {
      let handCheck:Hand = hands[i];
      if (handCheck._id===handIdToFind)
        return i;
    }
    return -1;
  }

  static indexOfUser(hands:Hand[], userId:string=Meteor.userId()):number {
    for (let i=0; i<hands.length; i++) {
      if (hands[i].userId===userId) {
        return i;
      }
    }
    return -1;
  }
  
  static handForUser(hands:Hand[], userId:string=Meteor.userId()):Hand {
    return hands[Hand.indexOfUser(hands, userId)];
  }

  sortHand():void {
    let compare;
    if (this.handSortSequence===SortSequence.RANK) {
      compare = (cardA:Card, cardB:Card)=> {
        if (cardA.rank === cardB.rank) {
          return cardA.suit - cardB.suit;
        }
        return cardA.rank - cardB.rank;
      };
      this.handSortSequence = SortSequence.SUIT; // Change for next time
    } else {
      compare = (cardA:Card, cardB:Card)=> {
        if (cardA.suit === cardB.suit) {
          return cardA.rank - cardB.rank;
        }
        return cardA.suit - cardB.suit;
      };
      this.handSortSequence = SortSequence.RANK; // Change for next time
    }
    this.cardsInHand.sort(compare);
  }
}
 
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
 

