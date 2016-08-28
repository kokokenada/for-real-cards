import { Mongo } from 'meteor/mongo';
import 'meteor/aldeed:simple-schema';
import 'meteor/konecty:mongo-counter'; declare let incrementCounter:any;

let CounterCollection = new Mongo.Collection("counters");

export function getNextSequence(counterType:string):number {
  return incrementCounter(CounterCollection, counterType);
}


