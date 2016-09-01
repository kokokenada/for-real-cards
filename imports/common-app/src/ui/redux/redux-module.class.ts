
import {Reducer} from "redux";
import { Epic } from 'redux-observable';

export abstract class ReduxModule<T> {
  reducer:Reducer<T>;
  epics:Epic[]=[];        // Stream based middleware
  middlewares:any[]=[];   // Normal redux middleware
  enhancers:any[]=[];
  actions:Object;
  abstract initialize():void;
}
