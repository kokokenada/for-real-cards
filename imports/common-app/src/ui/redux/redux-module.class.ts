
import { Reducer } from "redux";
import { Epic } from 'redux-observable';

export abstract class ReduxModule<STATE, ACTION> {
  reducer:{name: string, reducer:Reducer<STATE>};
  epics:Epic<ACTION>[]=[];        // Stream based middleware
  middlewares:any[]=[];   // Normal redux middleware
  enhancers:any[]=[];
  actions:Object;
  abstract initialize():void;
}
