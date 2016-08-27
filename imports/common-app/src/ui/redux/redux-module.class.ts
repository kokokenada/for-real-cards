
import {Reducer} from "redux";

export abstract class ReduxModule<T> {
  reducer:Reducer<T>;
  epics:any[]=[]; // How to type this?
  enhancers:any[]=[];
}
