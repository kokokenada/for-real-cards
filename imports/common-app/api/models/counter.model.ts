import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

let CounterCollection = new Mongo.Collection("counters");

class CounterClass {
  _id:string;
  sequence:number
}
let CounterSchema = new SimpleSchema({
  sequence: {
    type: Number,
    optional: true // Will not have value during app initialization
  }
});

if (Meteor.isServer) {
  Meteor.methods({
    CommonGetNextSequence: function (counterType:string):number {
      return getNextSequence(counterType);
    }
  });

}

export function getNextSequence(counterType:string):number {
  let ret:CounterClass = CounterCollection.findAndModify(
    {
      query: {_id: counterType},
      update: {$inc: {sequence: 1}},
      new: true
    }
  );
  if (!ret) {
    CounterCollection.insert({_id: counterType, sequence: 1});
    return 1;
  }
  return ret.sequence;
}


CounterCollection.attachSchema(CounterSchema);

