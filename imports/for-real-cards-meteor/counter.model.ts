import {Mongo} from 'meteor/mongo';
import 'meteor/aldeed:simple-schema';
import "meteor/konecty:mongo-counter";

let CounterCollection = new Mongo.Collection("counters");

export function getNextSequence(counterType: string): number {
  return Package['konecty:mongo-counter'].incrementCounter(CounterCollection, counterType);
}


if (Meteor.isServer) {
  Meteor.methods({
    CommonGetNextSequence: function (counterType: string): number {
      return getNextSequence(counterType);
    }
  });
}
